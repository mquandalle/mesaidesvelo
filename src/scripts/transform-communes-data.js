// A script to generate a static json file with the transformed communes data.
// This is run a a build-time script instead of a runtime function call mostly
// to avoid a ~1s cold start penalty.
//
// During development it is possible to enable hot reloads by adding the
// following import somewhere in the dependency graph:
//
// import '../src/scripts/transform-communes-data.js';
import { slugify } from '../lib/utils.js';
import { loadJsonFile, writeJsonFile } from '../lib/readWriteJson.js';

const communes = loadJsonFile('node_modules/@etalab/decoupage-administratif/data/communes.json');
const epci = loadJsonFile('node_modules/@etalab/decoupage-administratif/data/epci.json');

const duplicateCommunesNames = communes
	.map(({ nom }) => slugify(nom))
	.sort()
	.reduce((acc, cur, i, arr) => {
		if (cur === arr[i - 1] && cur !== acc[acc.length - 1]) {
			acc.push(cur);
		}
		return acc;
	}, []);

const villesAvecArrondissements = {
	Paris: '75000',
	Marseille: '13000',
	Lyon: '69000'
};

const communesInEpci = Object.fromEntries(
	epci.flatMap(({ nom, membres }) => membres.map(({ code }) => [code, nom]))
);

const extraData = [
	{
		nom: 'Monaco',
		codePostal: '980000',
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
			codesPostaux: villesAvecArrondissements[c.nom]
				? [villesAvecArrondissements[c.nom], ...c.codesPostaux]
				: c.codesPostaux,
			codePostal: villesAvecArrondissements[c.nom] ?? c.codesPostaux[0]
		})),
	...extraData
].map((c) => ({
	...c,
	slug:
		slugify(c.nom) + (duplicateCommunesNames.includes(slugify(c.nom)) ? `-${c.departement}` : '')
}));

writeJsonFile('src/data/communes.json', data);
