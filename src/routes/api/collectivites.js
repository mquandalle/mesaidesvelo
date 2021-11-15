// API de recherche dans la liste des commune.
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

import fuzzysort from 'fuzzysort';
import communes from '@etalab/decoupage-administratif/data/communes.json';
import epci from '@etalab/decoupage-administratif/data/epci.json';
import { slugify } from '$lib/utils';

const communesInEpci = epci.reduce((acc, { nom, membres }) => {
	return { ...acc, ...Object.fromEntries(membres.map(({ code }) => [code, nom])) };
}, {});

const data = communes
	.filter(
		(c) =>
			c.type === 'commune-actuelle' && c.codesPostaux && c.population && !c.code?.startsWith('97')
	)
	.map((c) => ({
		...c,
		...(communesInEpci[c.code] ? { epci: communesInEpci[c.code] } : {}),
		slug: slugify(c.nom),
		codePostal: c.codesPostaux[0],
		indexedName: fuzzysort.prepare(c.nom),
		codePostaux: fuzzysort.prepare(c.codesPostaux.join(' '))
	}));

const searchOptions = {
	keys: ['indexedName', 'codePostaux'],
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
	const search = query.get('search')?.replace(/\s/g, '');
	const slug = query.get('slug');

	const pick = ({ nom, slug, epci, codePostal, departement, region }) => ({
		nom,
		slug,
		epci,
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
			body: fuzzysort.go(search, data, searchOptions).map(({ obj }) => pick(obj))
		};
	} else {
		// Par défaut on retourne les communes les plus peuplées
		return {
			body: data
				.sort((a, b) => b.population - a.population)
				.slice(0, 10)
				.map(pick)
		};
	}
}
