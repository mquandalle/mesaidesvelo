import Publicodes from 'publicodes';
import aides from '../src/aides.yaml';
import aidesAndCollectivities from '$lib/data/aides-collectivities.json';
import { formatDescription } from '$lib/utils';

type Aide = {
	title: string;
	description: string;
	url: string;
	/**
	 * Le montant de l'aide est calculé seulement si le type de vélo a été
	 * précisé en entrée.
	 */
	amount?: number;
};

type InputParameters = Partial<{
	'localisation . pays': string;
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
	'vélo . prix': number;
	'revenu fiscal de référence': number;
}>;

const engine = new Publicodes(aides as any);

/**
 *  Retourne la liste des aides disponibles pour une situation donnée
 */
export default function aidesVelo(situation: InputParameters = {}): Array<Aide> {
	engine.setSituation(formatInput(situation));

	return Object.entries(aidesAndCollectivities)
		.filter(
			([, { country: aideCountry }]) =>
				!situation['localisation . pays'] || aideCountry === situation['localisation . pays']
		)
		.flatMap(([ruleName]) => {
			const rule = engine.getRule(ruleName);
			const collectivity = aidesAndCollectivities[ruleName].collectivity;

			const metaData = {
				id: ruleName,
				title: rule.title,
				description: rule.rawNode.description,
				url: (rule.rawNode as any).lien,
				collectivity,
			};

			if (!situation['vélo . type']) {
				return [metaData];
			}
			const { nodeValue } = engine.evaluate({ valeur: ruleName, unité: '€' });
			if (typeof nodeValue === 'number' && nodeValue > 0) {
				return [
					{
						...metaData,
						description: formatDescription({
							ruleName,
							engine,
							veloCat: situation['vélo . type'],
						}),
						amount: nodeValue,
					},
				];
			} else {
				return [];
			}
		});
}

const formatInput = (input: InputParameters) =>
	Object.fromEntries(
		Object.entries(input).map(([key, val]) => [
			key,
			key === 'localisation . epci'
				? `'${epciSirenToName[val]}'`
				: typeof val === 'string'
				? `'${val}'`
				: val,
		])
	);

const epciSirenToName = Object.fromEntries(
	Object.values(aidesAndCollectivities).flatMap(({ collectivity }) => {
		if (collectivity.kind !== 'epci') {
			return [];
		}
		return [[(collectivity as any).code, collectivity.value]];
	})
);
