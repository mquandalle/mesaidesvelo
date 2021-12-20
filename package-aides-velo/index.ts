import Publicodes from 'publicodes';
import aides from '../src/aides.yaml';
import { aidesRuleNames, associateCollectivityMetadata } from '$lib/aides-analysis';

type Aide = {
	title: string;
	description: string;
	url: string;
	amount: number;
};

type InputParameters = {
	'localisation . code insee': string;
	'localisation . epci': string;
	'localisation . département': string;
	'localisation . région': string;
	'vélo . type':
		| 'mécanique simple'
		| 'électrique'
		| 'cargo'
		| 'cargo électrique'
		| 'pliant'
		| 'motorisation';
	'vélo . prix'?: number;
};

const engine = new Publicodes(aides as any);

/**
 *  Retourne la liste des aides disponibles pour une situation donnée
 */
export default function aidesVelo(situation: InputParameters): Array<Aide> {
	engine.setSituation(formatInput(situation));

	return aidesRuleNames
		.map((ruleName) => {
			const rule = engine.getRule(ruleName);
			const collectivity = associateCollectivityMetadata(rule).collectivity;
			const { nodeValue } = engine.evaluate({ valeur: ruleName, unité: '€' });

			return {
				title: rule.title,
				description: rule.rawNode.description,
				url: (rule.rawNode as any).lien,
				amount: nodeValue as number,
				collectivity
			};
		})
		.filter(({ amount, url }) => amount && url);
}

const formatInput = (input: InputParameters) =>
	Object.fromEntries(
		Object.entries(input).map(([key, val]) => [
			key,
			typeof val === 'string' ? `'${val.replace(/'/g, '’')}'` : val
		])
	);
