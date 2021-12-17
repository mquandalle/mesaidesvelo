import fuzzysort from 'fuzzysort';
import { removeAccents } from '$lib/utils';
import data from '../data/communes.json';

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

export default indexedData;
