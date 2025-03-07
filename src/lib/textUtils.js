import { engine } from '$lib/engine';
import { BIKE_KINDS } from './aides-velo-utils';

// The list in `velo . type` only contains primary kinds that can be used as
// inputs in our UIs. But hte rule AST also reference some kinds “computed”
// from the primary kind provided. We need to add them manually to the
// search list. We associated them with a primary kind that can be used for
// runtime evaluation.
export const getBikeKind = (kind) => {
	const veloKindsComputed = {
		mécanique: 'mécanique simple',
		'mécanique ou électrique': 'mécanique simple',
	};

	return veloKindsComputed[kind] ?? kind;
};

const engineBis = engine.shallowCopy();
export function aidesPerVeloKind(aide) {
	const getMaximumAideForVeloKind = (kind) =>
		engineBis
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
				'vélo . type': `'${getBikeKind(kind)}'`,
			})
			.evaluate(aide.dottedName);

	const allActiveAides = BIKE_KINDS.map((kind) => [kind, getMaximumAideForVeloKind(kind)]).filter(
		([, max]) => max.nodeValue !== null && max.nodeValue !== 0,
	);

	return compactAidesList(allActiveAides);
}

// TODO: this list is hacky
const compactionOptions = [
	{
		keys: ['électrique', 'pliant électrique'],
		remplace: 'électrique',
	},
	{
		keys: ['pliant', 'pliant électrique'],
		remplace: 'pliant',
	},
	{
		keys: ['électrique', 'cargo électrique'],
		remplace: 'électrique',
	},
	{
		keys: ['mécanique simple'],
		remplace: 'mécanique',
	},
	{
		keys: ['pliant', 'mécanique'],
		remplace: 'mécanique',
	},
	{
		keys: ['cargo', 'cargo électrique'],
		remplace: 'cargo',
	},
	{
		keys: ['cargo', 'mécanique'],
		remplace: 'mécanique',
	},
	{
		keys: ['électrique', 'mécanique'],
		remplace: 'mécanique ou électrique',
	},
];

function compactAidesList(aidesList) {
	let res = Object.fromEntries(aidesList);
	for (let { keys, remplace } of compactionOptions) {
		if (keys.every((key) => res[key] && res[key].nodeValue === res[keys[0]].nodeValue)) {
			res = Object.fromEntries([
				...Object.entries(res).filter(([key]) => !keys.includes(key)),
				[remplace, res[keys[0]]],
			]);
		}
	}
	return Object.entries(res);
}
