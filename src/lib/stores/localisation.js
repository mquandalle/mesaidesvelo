import { derived, writable } from 'svelte/store';

export const localisation = writable(null);

export const localisationPublicodesSituation = derived(localisation, ($localisation) =>
	$localisation
		? {
				'localisation . code postal': `'${$localisation.codePostal}'`,
				'localisation . intercommunalité': `'${$localisation.intercommunalite || ''}'`,
				'localisation . département': `'${$localisation.departement}'`,
				'localisation . région': `'${$localisation.region}'`
		  }
		: {}
);
