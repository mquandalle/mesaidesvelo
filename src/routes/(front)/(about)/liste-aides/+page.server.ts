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

const groupBy = <T>(list: T[], f: (elm: T) => string): Record<string, T[]> =>
	list.reduce(
		(acc, elm) => {
			const key = f(elm);
			return {
				...acc,
				[key]: [...(acc[key] ?? []), elm],
			};
		},
		{} as Record<string, T[]>,
	);

const associatedCollectivities = Object.keys(aidesCollectivites).map((ruleName) => ({
	...engine.getRule(ruleName),
	...aidesCollectivites[ruleName],
}));

const collectivitiesTitles = associatedCollectivities.reduce(
	(acc, collectivity) => {
		const title = collectivity.rawNode.titre;
		if (!acc.all.includes(title)) {
			acc.all.push(title);
		} else {
			acc.duplicates.push(title);
		}
		return acc;
	},
	{ all: [], duplicates: [] },
);

const formatAideForClient = (aide) => {
	return {
		titre: aide.rawNode.titre.replace(/région/i, '').trim(),
		...(collectivitiesTitles.duplicates.includes(aide.rawNode.titre) && {
			description: aide.rawNode.description,
		}),
		lien: aide.rawNode.lien,
		slug: aide.slug,
		maximumsPerVeloKind: aidesPerVeloKind(aide)
			.sort(([, maxA], [, maxB]) => maxA.nodeValue - maxB.nodeValue)
			.map(([kind, maximumAide]) => [kind, formatValue(maximumAide)]),
	};
};

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const aidesEtat = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'pays' && collectivity.value === 'France')
		.map(({ rawNode }) => ({
			titre: rawNode.titre.replace(/de l'état/i, '').trim(),
		}));

	const aidesRegions = associatedCollectivities
		.filter(({ collectivity }) => collectivity.kind === 'région')
		.map((aide) => formatAideForClient(aide));

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
					.map((aide) => formatAideForClient(aide)),
			]),
	);

	return { aidesEtat, aidesRegions, aidesLocales };
}
