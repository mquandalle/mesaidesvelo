// A script to generate a static json file with the transformed communes data.
// This is run a a build-time script instead of a runtime function call mostly
// to avoid a ~1s cold start penalty.
//
// During development it is possible to enable hot reloads by adding the
// following import somewhere in the dependency graph:
//
// import '../src/scripts/transform-communes-data.js';

import { slugify } from '../lib/utils.js';
import { writeJsonData } from './writeData.js';

import communes from '@etalab/decoupage-administratif/data/communes.json' assert { type: 'json' };
import epci from '@etalab/decoupage-administratif/data/epci.json' assert { type: 'json' };

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
		pays: 'monaco'
	},
	{
		nom: 'Luxembourg',
		codePostal: '1111',
		code: '99137',
		codesPostaux: ['1111'],
		departement: '',
		region: '',
		population: 632275,
		pays: 'luxembourg'
	}
];

const data = [
	...communes
		.filter(
			(c) =>
				c.type === 'commune-actuelle' && c.codesPostaux && c.population && !c.code?.startsWith('97')
		)
		.map((c) => {
			if (villesAvecArrondissements[c.nom]) {
				c.codesPostaux.push(villesAvecArrondissements[c.nom]);
			}

			const uniq = (l) => [...new Set(l)];
			const countTrailingZeros = (x) => x.toString().match(/0+$/)?.[0].length ?? 0;

			return {
				code: c.code,
				nom: c.nom,
				departement: c.departement,
				region: c.region,
				population: c.population,
				...(communesInEpci[c.code] ? { epci: communesInEpci[c.code] } : {}),
				codesPostaux: uniq(c.codesPostaux).sort(
					(a, b) => countTrailingZeros(b) - countTrailingZeros(a)
				)
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

writeJsonData('communes.json', data);
