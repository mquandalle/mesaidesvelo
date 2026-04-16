/**
 * /!\ There is a duplicate of this script on publicodes-aides-velo rules model.
 *
 * Script to generate a static json file with communes data enriched with EPCI.
 * This is used by other scripts to map collectivities to communes.
 */

import { writeJsonData } from './writeData.js';

import communes from '@etalab/decoupage-administratif/data/communes.json' with { type: 'json' };
import epci from '@etalab/decoupage-administratif/data/epci.json' with { type: 'json' };
import { slugify } from '../lib/utils.js';

// We add slug to communes. If there are multiple communes with the same name, we add the department code to the slug.

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
  Paris: "75000",
  Marseille: "13000",
  Lyon: "69000",
};

// Create a map of communes to their EPCI
const communesInEpci = Object.fromEntries(
  epci.flatMap(({ nom, membres }) => membres.map(({ code }) => [code, nom])),
);

// Extra data for Monaco and Luxembourg
const extraData = [
	{
		code: '99138',
		nom: 'Monaco',
		departement: '06',
		region: '84',
		population: 39244,
		zfe: false,
		codesPostaux: ['98000'],
	},
	{
		code: '99137',
		nom: 'Luxembourg',
		departement: '',
		region: '',
		population: 632275,
		zfe: false,
		codesPostaux: ['1111'],
	},
];

// Transform communes data
const data = [
  ...communes
    .filter(
      (c) => c.type === "commune-actuelle" && c.codesPostaux && c.population,
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
        zfe: false,
        ...(communesInEpci[c.code] ? { epci: communesInEpci[c.code] } : {}),
        codesPostaux: uniq(c.codesPostaux).sort(
          (a, b) => countTrailingZeros(b) - countTrailingZeros(a),
        ),
      };
    }),
  ...extraData,
].map((c) => ({
  ...c,
  slug: slugify(c.nom)
    + (duplicateCommunesNames.includes(slugify(c.nom))
      ? `-${c.departement ?? c.code.slice(0, 2)}`
      : ""),
}));

writeJsonData('communes.json', data);

console.log(`${data.length} communes traitées.`);
