import { loadJsonFile, writeJsonFile, loadTextFile } from '../lib/readWriteJson.js';
import Publicodes, { reduceAST } from 'publicodes';
import { parse } from 'yaml';

const communes = loadJsonFile('src/lib/data/communes.json');
const epci = loadJsonFile('node_modules/@etalab/decoupage-administratif/data/epci.json');
const departements = loadJsonFile(
	'node_modules/@etalab/decoupage-administratif/data/departements.json'
);
const regions = loadJsonFile('node_modules/@etalab/decoupage-administratif/data/regions.json');

const sourceRules = loadTextFile('src/aides.yaml');

const engine = new Publicodes(parse(sourceRules));

const aidesRuleNames = Object.keys(engine.getParsedRules()).filter(
	(ruleName) => ruleName.startsWith('aides .') && engine.getRule(ruleName).rawNode.titre
);

const extractCollectivityFromAST = (rule) => {
	const localisationKinds = ['pays', 'région', 'département', 'epci', 'code insee'];
	const { kind, value } = reduceAST(
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
	// In our rule basis we reference EPCI by their name but for iteroperability
	// with third-party systems it is more robust to expose their SIREN code.
	if (kind === 'epci') {
		const code = epci.find(({ nom }) => nom === value)?.code;

		if (!code) {
			console.warn(`Bad EPCI code pour ${value}`);
		}

		return { kind, value, code };
	}
	return { kind, value };
};

const communesSorted = communes.sort((a, b) => b.population - a.population);

const getCodeInseeForCollectivity = ({ kind, value }) => {
	switch (kind) {
		case 'région':
			return regions.find(({ code }) => code === value)?.chefLieu;
		case 'département':
			return departements.find(({ code }) => code === value).chefLieu;
		case 'epci':
			return communesSorted.find(({ epci }) => epci === value)?.code;
		case 'code insee':
			return value;
	}
};

const getCommune = (codeInsee) =>
	codeInsee && communesSorted.find(({ code }) => code === codeInsee);

// TODO: a bit fragile, we should sync this logic with
// `engine.evaluate('localisation . pays')
const getCountry = (rule) =>
	rule.dottedName === 'aides . monaco'
		? 'monaco'
		: rule.dottedName === 'aides . luxembourg'
		? 'luxembourg'
		: 'france';

const associateCollectivityMetadata = (rule) => {
	const collectivity = extractCollectivityFromAST(rule);
	const codeInsee = getCodeInseeForCollectivity(collectivity);
	const { slug, departement, population } = getCommune(codeInsee) ?? {};
	const country = getCountry(rule);
	return {
		collectivity,
		codeInsee,
		departement,
		population,
		slug,
		country
	};
};

const res = Object.fromEntries(
	aidesRuleNames.map((ruleName) => [
		ruleName,
		associateCollectivityMetadata(engine.getRule(ruleName))
	])
);

writeJsonFile('src/lib/data/aides-collectivities.json', res);
