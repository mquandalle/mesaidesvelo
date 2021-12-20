import departements from '@etalab/decoupage-administratif/data/departements.json';
import regions from '@etalab/decoupage-administratif/data/regions.json';
import { reduceAST } from 'publicodes';
import publicodesRules from '../aides.yaml';
import communes from '$lib/data/communes.json';

export const aidesRuleNames = Object.keys(publicodesRules).filter(
	(ruleName) => ruleName.startsWith('aides .') && publicodesRules[ruleName].titre
);

const extractCollectivityFromAST = (rule) => {
	const localisationKinds = ['pays', 'région', 'département', 'epci', 'code insee'];
	return reduceAST(
		(acc, node) => {
			if (acc) return acc;
			if (node.nodeKind === 'operation' && node.operationKind === '=') {
				for (let localisationKind of localisationKinds) {
					if (node.explanation[0]?.dottedName === `localisation . ${localisationKind}`) {
						return {
							kind: localisationKind,
							value: node.explanation[1]?.nodeValue
						};
					}
				}
			}
		},
		null,
		rule
	);
};

const communesSorted = communes.sort((a, b) => b.population - a.population);

const getCodeInseeForCollectivity = ({ kind, value }) => {
	switch (kind) {
		case 'région':
			return regions.find(({ code }) => code === value)?.chefLieu;
		case 'département':
			return departements.find(({ code }) => code === value).chefLieu;
		case 'epci':
			return communesSorted.find(({ epci }) => epci?.replace(/'/g, '’') === value)?.code;
		case 'code insee':
			return value;
	}
};

const getSlugForCodeInsee = (codeInsee) =>
	codeInsee && communesSorted.find(({ code }) => code === codeInsee)?.slug;

export const associateCollectivityMetadata = (rule) => {
	const collectivity = extractCollectivityFromAST(rule);
	const codeInsee = getCodeInseeForCollectivity(collectivity);
	const slug = getSlugForCodeInsee(codeInsee);
	return {
		...rule,
		collectivity,
		codeInsee,
		slug
	};
};
