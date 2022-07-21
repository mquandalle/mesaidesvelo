import { derived, writable } from 'svelte/store';

export const localisation = writable(null);
export const answers = writable({});

export const publicodeSituation = derived([localisation, answers], ([$localisation, $answers]) => ({
	...Object.fromEntries(Object.entries($answers).filter(([, val]) => val)),
	...($localisation
		? {
				'localisation . code insee': `'${$localisation.codeInsee}'`,
				'localisation . epci': `'${$localisation.epci || ''}'`,
				'localisation . département': `'${$localisation.departement}'`,
				'localisation . région': `'${$localisation.region}'`
		  }
		: {})
}));
