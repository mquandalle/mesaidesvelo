// API de recherche dans la liste des communes.
//
// Nous pourrions utiliser directement l'API fournie par Etalab
// https://geo.api.gouv.fr/decoupage-administratif/communes mais elle ne répond
// pas à plusieurs de nos besoins :
// - associer les communes à une "métropole" (Bordeaux Métropole, Grand Lyon
//   etc.) ou une intercommunalité. En effet, c'est à cet échelon que sont
//   souvent définies les aides à la mobilité.
// - chercher par le nom de la commune ou par le code postal via le même champ
//   de recherche
// - « recherche approximative » pour gérer les erreurs de saisie de
//   l'utilisateur.

import { rawCityToFullLocalisation, removeAccents } from '$lib/utils';
import fuzzysort from 'fuzzysort';
import data from '$lib/data/communes.json';

const indexedData = data.flatMap(({ codesPostaux, ...rest }) =>
	codesPostaux.map((codePostal, i) => {
		const cpPrincipal = i === 0;
		return {
			...rest,
			codePostal,
			indexedName: cpPrincipal ? fuzzysort.prepare(removeAccents(rest.nom)) : '',
			indexedCodePostal: fuzzysort.prepare(codePostal),
			population: cpPrincipal ? rest.population : 10,
		};
	}),
);

const searchOptions = {
	keys: ['indexedName', 'indexedCodePostal'],
	limit: 10,
	threshold: -1000,
	scoreFn: (a) =>
		// testé à la main pour faire remonter les plus grosses villes en premier
		Math.max(
			a[0] ? a[0].score - 1000 / Math.log(a.obj.population) : -1001,
			a[1] ? a[1].score - 1 / Math.log(a.obj.population) : -1001,
		),
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const search = removeAccents(url.searchParams.get('search')?.replace(/\s/g, '').toLowerCase());

	const results = search
		? fuzzysort
				.go(search, indexedData, searchOptions)
				.map(({ obj }) => rawCityToFullLocalisation(obj))
		: // Par défaut on retourne les communes les plus peuplées
			indexedData
				.sort((a, b) => b.population - a.population)
				.slice(0, 10)
				.map(rawCityToFullLocalisation);

	return new Response(JSON.stringify(results));
}
