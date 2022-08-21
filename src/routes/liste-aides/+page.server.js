import aidesCollectivities from '$lib/data/aides-collectivities.json';
import { engine } from '$lib/engine';
import { formatValue } from 'publicodes';
import publicodesRules from '../../aides.yaml';

export const prerender = true;

/**
 * @typedef {{
 *   titre: string,
 *   slug: string,
 *   lien: string,
 *   maximumsPerVeloKind: Array<[string, number]>
 * }} AideSummary
 */

// The list in `velo . type` only contains primary kinds that can be used as
// inputs in our UIs. But hte rule AST also reference some kinds “computed”
// from the primary kind provided. We need to add them manually to the
// search list. We associated them with a primary kind that can be used for
// runtime evaluation.
export const getBikeKind = (kind) => {
	const veloKindsComputed = {
		mécanique: 'mécanique simple',
		'mécanique ou électrique': 'mécanique simple'
	};

	return veloKindsComputed[kind] ?? kind;
};

const aidesPerVeloKind = (aide) => {
	const getMaximumAideForVeloKind = (kind) =>
		engine
			.setSituation({
				'localisation . code insee': `'${
					aide.collectivity.kind === 'région' ? '' : aide.codeInsee
				}'`,
				'localisation . epci': `'${
					aide.collectivity.kind === 'epci' ? aide.collectivity.value : ''
				}'`,
				'localisation . région': `'${
					aide.collectivity.kind === 'région' ? aide.collectivity.value : ''
				}'`,
				'localisation . département': `'${aide.departement}'`,
				'vélo . type': `'${getBikeKind(kind)}'`
			})
			.evaluate(aide.dottedName);

	return publicodesRules['vélo . type'].possibilités
		.map((kind) => [kind, getMaximumAideForVeloKind(kind)])
		.filter(([, max]) => max.nodeValue !== null && max.nodeValue !== 0);
};

// TODO: this list is hacky
const compactionOptions = [
	{
		keys: ['électrique', 'cargo électrique', 'cargo', 'mécanique simple', 'pliant'],
		remplace: 'mécanique ou électrique'
	},
	{
		keys: ['électrique', 'cargo électrique'],
		remplace: 'électrique'
	},
	{
		keys: ['pliant', 'mécanique simple', 'cargo'],
		remplace: 'mécanique'
	},
	{
		keys: ['pliant', 'mécanique simple'],
		remplace: 'mécanique'
	},
	{
		keys: ['cargo', 'cargo électrique'],
		remplace: 'cargo'
	},
	{
		keys: ['mécanique simple'],
		remplace: 'mécanique'
	}
];

const compactAidesList = (aidesList) => {
	let res = Object.fromEntries(aidesList);
	for (let { keys, remplace } of compactionOptions) {
		if (keys.every((key) => res[key] && res[key].nodeValue === res[keys[0]].nodeValue)) {
			res = Object.fromEntries([
				...Object.entries(res).filter(([key]) => !keys.includes(key)),
				[remplace, res[keys[0]]]
			]);
		}
	}
	return Object.entries(res);
};

const groupBy = (list, f) =>
	list.reduce((acc, elm) => {
		const key = f(elm);
		return {
			...acc,
			[key]: [...(acc[key] ?? []), elm]
		};
	}, {});

const formatAideForClient = (aide) => ({
	titre: aide.rawNode.titre.replace(/région/i, '').trim(),
	lien: aide.rawNode.lien,
	slug: aide.slug,
	maximumsPerVeloKind: compactAidesList(aidesPerVeloKind(aide))
		.sort(([, maxA], [, maxB]) => maxA.nodeValue - maxB.nodeValue)
		.map(([kind, maximumAide]) => [kind, formatValue(maximumAide)])
});

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const associatedCollectivities = Object.keys(aidesCollectivities).map((ruleName) => ({
		...engine.getRule(ruleName),
		...aidesCollectivities[ruleName]
	}));

	const aidesEtat = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'pays' && collectivity.value === 'France')
		.map(({ rawNode }) => ({
			titre: rawNode.titre.replace(/de l’état/i, '').trim()
		}));

	const aidesRegions = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'région')
		.map(formatAideForClient);

	const aidesLocales = Object.entries(
		groupBy(
			associatedCollectivities.filter(({ collectivity }) =>
				['code insee', 'epci', 'département'].includes(collectivity.kind)
			),
			({ departement }) => departement
		)
	)
		.sort(([a], [b]) => parseInt(a) - parseInt(b))
		.map(([dep, aides]) => [dep, aides.map(formatAideForClient)]);

	return { aidesEtat, aidesRegions, aidesLocales };
}
