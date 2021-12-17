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

import { removeAccents } from '$lib/utils';
import fuzzysort from 'fuzzysort';
import data from '../../data/communes.json';

const indexedData = data
	.flatMap(({ codesPostaux, ...rest }) =>
		(codesPostaux ?? [rest.codePostal]).map((cp, i) => ({
			...rest,
			codePostal: cp,
			cpPrincipal: i === 0,
			population: i === 0 ? rest.population : 10
		}))
	)
	.map((c) => ({
		...c,
		indexedName: c.cpPrincipal ? fuzzysort.prepare(removeAccents(c.nom)) : '',
		indexedCodePostal: fuzzysort.prepare(c.codePostal)
	}));

const searchOptions = {
	keys: ['indexedName', 'indexedCodePostal'],
	limit: 10,
	threshold: -1000,
	scoreFn: (a) =>
		// testé à la main pour faire remonter les plus grosses villes en premier
		Math.max(
			a[0] ? a[0].score - 1000 / Math.log(a.obj.population) : -1001,
			a[1] ? a[1].score - 1 / Math.log(a.obj.population) : -1001
		)
};

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ query }) {
	const search = removeAccents(query.get('search')?.replace(/\s/g, '').toLowerCase());
	const slug = query.get('slug');

	const pick = ({ code, nom, slug, epci, codePostal, departement, region }) => ({
		nom,
		slug,
		epci,
		codeInsee: code,
		codePostal,
		departement,
		region
	});

	if (slug) {
		const res = data.find((c) => c.slug === slug);
		if (res) {
			return { body: pick(res) };
		}
	} else if (search) {
		return {
			body: fuzzysort.go(search, indexedData, searchOptions).map(({ obj }) => pick(obj))
		};
	} else {
		// Par défaut on retourne les communes les plus peuplées
		return {
			body: indexedData
				.sort((a, b) => b.population - a.population)
				.slice(0, 10)
				.map(pick)
		};
	}
}
