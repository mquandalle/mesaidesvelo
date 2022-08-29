import { page } from '$app/stores';
import { derived, writable } from 'svelte/store';

export const localisation = writable(null);
export const answers = writable({});
export const revenuFiscal = writable(undefined);

export const resetAnswers = () => answers.set({});

export const localisationSituation = derived([localisation], ([$localisation]) =>
	$localisation
		? {
				'localisation . code insee': `'${$localisation.codeInsee}'`,
				'localisation . epci': `'${$localisation.epci || ''}'`,
				'localisation . département': `'${$localisation.departement}'`,
				'localisation . région': `'${$localisation.region}'`,
		  }
		: {}
);

export const veloCat = derived([page], ([$page]) => {
	if ($page.routeId === '(search)/prime-a-la-conversion') {
		return 'prime-conversion';
	}
	return $page.url?.searchParams.get('velo') ?? null;
});

export const publicodeSituation = derived(
	[localisationSituation, answers, revenuFiscal, veloCat],
	([$localisationSituation, $answers, $revenuFiscal, $veloCat]) => {
		return {
			...$localisationSituation,
			...Object.fromEntries(Object.entries($answers).filter(([, val]) => val)),
			...($veloCat ? { 'vélo . type': `'${$veloCat}'` } : {}),
			...($revenuFiscal ? { 'revenu fiscal de référence': `${$revenuFiscal} €/mois` } : {}),
		};
	}
);
