export const ssr = false;

import { engine } from '$lib/engine';
import { aidesPerVeloKind } from '$lib/textUtils';
import { formatValue } from 'publicodes';
import aidesCollectivites from '$lib/data/aides-collectivities.json';

export const prerender = true;

/**
 * @typedef {{
 *   titre: string,
 *   slug: string,
 *   lien: string,
 *   maximumsPerVeloKind: Array<[string, number]>
 * }} AideSummary
 */

const groupBy = <T>(list: T[], f: (item: T) => string): Record<string, T[]> =>
	list.reduce((acc: Record<string, T[]>, elm) => {
		const key = f(elm);
		return {
			...acc,
			[key]: [...(acc[key] ?? []), elm],
		};
	}, {});

const formatAideForClient = (aide) => ({
	titre: aide.rawNode.titre.replace(/région/i, '').trim(),
	lien: aide.rawNode.lien,
	slug: aide.slug,
	maximumsPerVeloKind: aidesPerVeloKind(aide)
		.sort(([, maxA], [, maxB]) => maxA.nodeValue - maxB.nodeValue)
		.map(([kind, maximumAide]) => [kind, formatValue(maximumAide)]),
});

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const associatedCollectivities = Object.keys(aidesCollectivites).map((ruleName) => ({
		...engine.getRule(ruleName),
		...aidesCollectivites[ruleName],
	}));

	const aidesEtat = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'pays' && collectivity.value === 'France')
		.map(({ rawNode }) => ({
			titre: rawNode.titre.replace(/de l'état/i, '').trim(),
		}));

	const aidesRegions = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'région')
		.map(formatAideForClient);

	const aidesLocales = Object.fromEntries(
		Object.entries(
			groupBy(
				associatedCollectivities.filter(({ collectivity }) =>
					['code insee', 'epci', 'département'].includes(collectivity.kind),
				),
				({ departement }) => departement,
			),
		)
			.sort(([a], [b]) => parseInt(a) - parseInt(b))
			.map(([dep, aides]) => [
				dep,
				aides
					.sort((a, b) =>
						a.collectivity.kind === 'département'
							? -1
							: b.collectivity.kind === 'département'
								? 1
								: (b.population ?? 0) - (a.population ?? 0),
					)
					.map(formatAideForClient),
			]),
	);

	return { aidesEtat, aidesRegions, aidesLocales };
}
