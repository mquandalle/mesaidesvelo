import { derived, writable } from 'svelte/store';

export const localisation = writable(null);

export const localisationPublicodesSituation = derived(localisation, ($localisation) =>
	$localisation
		? {
				'localisation . code insee': `'${$localisation.codeInsee}'`,
				'localisation . epci': `'${$localisation.epci?.replace(/'/g, '’') || ''}'`,
				'localisation . département': `'${$localisation.departement}'`,
				'localisation . région': `'${$localisation.region}'`
		  }
		: {}
);
