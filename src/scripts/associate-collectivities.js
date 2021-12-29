import { loadJsonFile, writeJsonFile, loadTextFile } from '../lib/readWriteJson.js';
import Publicodes, { reduceAST } from 'publicodes';

const communes = loadJsonFile('src/lib/data/communes.json');
const departements = loadJsonFile(
	'node_modules/@etalab/decoupage-administratif/data/departements.json'
);
const regions = loadJsonFile('node_modules/@etalab/decoupage-administratif/data/regions.json');

const sourceRules = loadTextFile('src/aides.yaml');

const engine = new Publicodes(sourceRules);

const aidesRuleNames = Object.keys(engine.getParsedRules()).filter(
	(ruleName) => ruleName.startsWith('aides .') && engine.getRule(ruleName).rawNode.titre
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

const associateCollectivityMetadata = (rule) => {
	const collectivity = extractCollectivityFromAST(rule);
	const codeInsee = getCodeInseeForCollectivity(collectivity);
	const slug = getSlugForCodeInsee(codeInsee);
	return {
		collectivity,
		codeInsee,
		slug
	};
};

const res = Object.fromEntries(
	aidesRuleNames.map((ruleName) => [
		ruleName,
		associateCollectivityMetadata(engine.getRule(ruleName))
	])
);

writeJsonFile('src/lib/data/aides-collectivities.json', res);
