import { derived, get, writable } from 'svelte/store';

export const localisation = writable(null);
export const answers = writable({});
export const revenuFiscal = writable(undefined);

export const resetAnswers = () => {
	if (Object.keys(get(answers)).length > 0) {
		answers.set({});
	}
};

export const localisationSituation = derived([localisation], ([$localisation]) =>
	$localisation
		? {
				'localisation . code insee': `'${$localisation.codeInsee}'`,
				'localisation . epci': `'${$localisation.epci || ''}'`,
				'localisation . ZFE': `'${$localisation.zfe ? 'oui' : 'non'}'`,
				'localisation . département': `'${$localisation.departement}'`,
				'localisation . région': `'${$localisation.region}'`,
		  }
		: {}
);

export const publicodeSituation = derived(
	[localisationSituation, answers, revenuFiscal],
	([$localisationSituation, $answers, $revenuFiscal]) => {
		return {
			...$localisationSituation,
			...Object.fromEntries(Object.entries($answers).filter(([, val]) => val)),
			...($revenuFiscal ? { 'revenu fiscal de référence': `${$revenuFiscal} €/mois` } : {}),
		};
	}
);
