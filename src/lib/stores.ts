import type { Questions, Situation } from '@betagouv/aides-velo';
import { derived, get, writable, type Readable } from 'svelte/store';

export const localisation = writable(null);
export const answers = writable({});
export const revenuFiscal = writable(undefined);
export const veloCat = writable<Questions['vélo . type']>();

export const resetAnswers = () => {
	if (Object.keys(get(answers)).length > 0) {
		answers.set({});
	}
};

export const veloTypeValue: Readable<Situation['vélo . type']> = derived([veloCat], ([$veloCat]) =>
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
