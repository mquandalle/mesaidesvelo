import type { Questions, RuleName, Situation } from '@betagouv/aides-velo';
import { derived, get, writable } from 'svelte/store';

export const localisation = writable<any | null>(null);
export const answers = writable({});
// NOTE: maybe should be added to persisting answers
export const revenuFiscal = writable(undefined);
export const veloCat = writable<Questions['vélo . type']>();

export const PERSISTING_ANSWSERS: RuleName[] = [
	'demandeur . en situation de handicap',
	'foyer . personnes',
];

/** resetAnswers() will remove all answers from the store except the ones listed in {@link PERSISTING_ANSWSERS} */
export const resetAnswers = () => {
	if (Object.keys(get(answers)).length > 0) {
		const persistingAnswers = Object.fromEntries(
			Object.entries(get(answers)).filter(([key]) => PERSISTING_ANSWSERS.includes(key as RuleName)),
		);
		answers.set(persistingAnswers);
	}
};

export const veloTypeValue = derived([veloCat], ([$veloCat]) =>
	$veloCat !== null ? (`'${$veloCat}'` as Situation['vélo . type']) : null,
);

export const localisationSituation = derived([localisation], ([$localisation]) =>
	$localisation
		? {
				'localisation . code insee': `'${$localisation.codeInsee}'`,
				'localisation . epci': `'${$localisation.epci || ''}'`,
				'localisation . ZFE': `${$localisation.zfe ? 'oui' : 'non'}`,
				'localisation . département': `'${$localisation.departement}'`,
				'localisation . région': `'${$localisation.region}'`,
			}
		: {},
);

export const publicodeSituation = derived(
	[localisationSituation, answers, revenuFiscal],
	([$localisationSituation, $answers, $revenuFiscal]) => {
		return {
			...$localisationSituation,
			...Object.fromEntries(Object.entries($answers).filter(([, val]) => val)),
			...($revenuFiscal
				? { 'revenu fiscal de référence par part': `${$revenuFiscal} €/mois` }
				: {}),
		};
	},
);
