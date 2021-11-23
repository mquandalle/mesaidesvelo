import { removeAccents, slugify } from '$lib/utils';
import communes from '@etalab/decoupage-administratif/data/communes.json';
import epci from '@etalab/decoupage-administratif/data/epci.json';

const duplicateCommunesNames = communes
	.map(({ nom }) => slugify(nom))
	.sort()
	.reduce((acc, cur, i, arr) => {
		if (cur === arr[i - 1] && cur !== acc[acc.length - 1]) {
			acc.push(cur);
		}
		return acc;
	}, []);

const communesInEpci = Object.fromEntries(
	epci.flatMap(({ nom, membres }) => membres.map(({ code }) => [code, nom]))
);

const extraData = [
	{
		nom: 'Monaco',
		codePostal: '98000',
		code: '99138',
		codesPostaux: ['98000'],
		departement: '06',
		region: '84',
		population: 39244,
		etat: 'monaco'
	}
];

const data = [
	...communes
		.filter(
			(c) =>
				c.type === 'commune-actuelle' && c.codesPostaux && c.population && !c.code?.startsWith('97')
		)
		.map((c) => ({
			...c,
			...(communesInEpci[c.code] ? { epci: communesInEpci[c.code] } : {}),
			codePostal: c.codesPostaux[0]
		})),
	...extraData
].map((c) => ({
	...c,
	slug:
		slugify(c.nom) + (duplicateCommunesNames.includes(slugify(c.nom)) ? `-${c.departement}` : ''),
	indexedName: removeAccents(c.nom),
	codePostaux: c.codePostal
}));

export default data;
