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

/**
 * We overwrite some of the codes provided in the Etalab source because of an
 * issue with the source data, see
 * https://github.com/etalab/decoupage-administratif/issues/25
 * @type {Record<string, Array<string>>}
 */
const diffCodesPostaux = loadJsonFile('src/scripts/diff-codepostaux.json');

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
		population: 39244
	},
	{
		nom: 'Luxembourg',
		codePostal: '1111',
		code: '99137',
		codesPostaux: ['1111'],
		departement: '',
		region: '',
		population: 632275
	}
];

const data = [
	...communes
		.filter(
			(c) =>
				c.type === 'commune-actuelle' && c.codesPostaux && c.population && !c.code?.startsWith('97')
		)
		.map((c) => {
			const codesPostaux = diffCodesPostaux[c.code] ?? c.codesPostaux;
			if (villesAvecArrondissements[c.nom]) {
				codesPostaux.unshift(villesAvecArrondissements[c.nom]);
			}

			const countTrailingZeros = (x) => x.toString().match(/0+$/)?.[0].length ?? 0;

			return {
				code: c.code,
				nom: c.nom,
				region: c.region,
				population: c.population,
				...(communesInEpci[c.code] ? { epci: communesInEpci[c.code] } : {}),
				codesPostaux: codesPostaux.sort((a, b) => countTrailingZeros(b) - countTrailingZeros(a))
			};
		}),
	...extraData
].map((c) => ({
	...c,
	slug:
		slugify(c.nom) +
		(duplicateCommunesNames.includes(slugify(c.nom))
			? `-${c.departement ?? c.code.slice(0, 2)}`
			: '')
}));

writeJsonFile('src/lib/data/communes.json', data);
