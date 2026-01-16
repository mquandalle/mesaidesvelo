import { engine } from '$lib/engine';
import { aidesPerVeloKind } from '$lib/textUtils';
import { formatValue } from 'publicodes';
import aidesCollectivites from '$lib/data/aides-collectivities.json';

export const prerender = true;

/**
 * @typedef {{
 *   titre: string,
 *   slug: string,
 *   lien: string,
 *   maximumsPerVeloKind: Array<[string, number]>
 * }} AideSummary
 */

const groupBy = (list, f) =>
	list.reduce((acc, elm) => {
		const key = f(elm);
		return {
			...acc,
			[key]: [...(acc[key] ?? []), elm],
		};
	}, {});

const formatAideForClient = (aide, allAides = []) => {
	const hasDuplicateTitre =
		allAides.filter(
			(a) =>
				a.rawNode.titre.replace(/région/i, '').trim() ===
				aide.rawNode.titre.replace(/région/i, '').trim(),
		).length > 1;

	return {
		titre: aide.rawNode.titre.replace(/région/i, '').trim(),
		...(hasDuplicateTitre && { description: aide.rawNode.description }),
		lien: aide.rawNode.lien,
		slug: aide.slug,
		maximumsPerVeloKind: aidesPerVeloKind(aide)
			.sort(([, maxA], [, maxB]) => maxA.nodeValue - maxB.nodeValue)
			.map(([kind, maximumAide]) => [kind, formatValue(maximumAide)]),
	};
};

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const associatedCollectivities = Object.keys(aidesCollectivites).map((ruleName) => ({
		...engine.getRule(ruleName),
		...aidesCollectivites[ruleName],
	}));

	const aidesEtat = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'pays' && collectivity.value === 'France')
		.map(({ rawNode }) => ({
			titre: rawNode.titre.replace(/de l'état/i, '').trim(),
		}));

	const aidesRegions = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'région')
		.map((aide) => formatAideForClient(aide, associatedCollectivities));

	const aidesLocales = Object.fromEntries(
		Object.entries(
			groupBy(
				associatedCollectivities.filter(({ collectivity }) =>
					['code insee', 'epci', 'département'].includes(collectivity.kind),
				),
				({ departement }) => departement,
			),
		)
			.sort(([a], [b]) => parseInt(a) - parseInt(b))
			.map(([dep, aides]) => [
				dep,
				aides
					.sort((a, b) =>
						a.collectivity.kind === 'département'
							? -1
							: b.collectivity.kind === 'département'
								? 1
								: (b.population ?? 0) - (a.population ?? 0),
					)
					.map((aide) => formatAideForClient(aide, associatedCollectivities)),
			]),
	);

	return { aidesEtat, aidesRegions, aidesLocales };
}
