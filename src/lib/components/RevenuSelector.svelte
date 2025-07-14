<script context="module" lang="ts">
	import { BIKE_KINDS } from '$lib/aides-velo-utils';
	import { engine, getEngine } from '$lib/engine';
	import { localisationSituation, veloCat } from '$lib/stores';
	import Engine, { formatValue, reduceAST } from 'publicodes';
	import { derived } from 'svelte/store';
	import Emoji from './Emoji.svelte';

	// In case the formula involve a “linear operation” such as additions or
	// product, we cannot extract a fixed set a threshold and we need to display
	// a input of type number.
	const numberFieldRequired = Symbol('number field required');

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	const uniq = (arr) => [...new Set(arr)];

	const engineBis = engine.shallowCopy();
	export const originalNames = derived(
		[localisationSituation, publicodeSituation],
		([$localisationSituation, $publicodeSituation]) => {
			if (!localisationSituation) {
				return [];
			}

			engineBis.setSituation({
				...$localisationSituation,
				// TODO: better handle `foyer . personnes` and more generally dependent
				// variables needed to compute the thresholds.
				'foyer . personnes': $publicodeSituation['foyer . personnes'] ?? 1,
			});

			return uniq(
				BIKE_KINDS.map((veloCat) => {
					const originalNames = collectivites
						.map((collectivite) => {
							const aide = engineBis.evaluate(`aides . ${collectivite}`);
							if (!aide.nodeValue) {
								return null;
							}
							// FIXME: Is it only a type error or this is a real issue?
							// @ts-ignore
							const originalRuleName = aide.explanation.find(
								({ condition }) => condition.nodeValue === true,
							).consequence.name;

							return originalRuleName;
						})
						.filter(Boolean);

					return originalNames;
				}).flat(),
			);
		},
	);

	// We do a static analysis of the rules AST to search for a particular rule name.
	// When in find it in a comparaison expression we retreive the value of the other
	// side of the expression.
	// For exemple in: applicable si: my . rule <= 400 €
	// We will retrieve [400]
	// We also need to handle mechanisms that are implemented using comparaisons such
	// as “grille” or “barème”.
	function findAllComparaisonsValue(dottedName: RuleName, { searchedName, unit }): number[] {
		const comparaisonOperators = ['<', '<=', '>', '>='];
		const linearOperatiors = ['-', '+', '*', '/'];

		// TODO: There might be a better way to convert a parsed node into a given unit.
		const convertValue = (node) => {
			const valeur = formatValue(engineBis.evaluate(node));
			if (
				valeur === '∞' ||
				valeur === 'Non applicable' ||
				valeur === 'Pas encore défini' ||
				valeur === 'Erreur dans le calcul du nombre'
			) {
				return Infinity;
			}

			return engineBis.evaluate({
				valeur: valeur.replace(/\s/g, ''),
				unité: unit,
			}).nodeValue;
		};

		const namesToFollow: RuleName[] = ['foyer . imposable', 'foyer . personnes'];

		const accumulateThresholds = (acc, node) => {
			if (acc === numberFieldRequired) {
				return acc;
			}

			if (node.nodeKind === 'grille' && node.explanation.assiette?.dottedName === searchedName) {
				const thresholds = node.explanation.tranches.map(({ plafond }) => convertValue(plafond));
				return [...acc, ...thresholds];
			} else if (
				node.nodeKind === 'operation' &&
				comparaisonOperators.includes(node.operationKind)
			) {
				if (node.explanation[0]?.dottedName === searchedName) {
					const value = convertValue(node.explanation[1]);
					return [...acc, value];
				} else if (node.explanation[1]?.dottedName === searchedName) {
					const value = convertValue(node.explanation[0]);
					return [...acc, value];
				}
			} else if (
				node.nodeKind === 'operation' &&
				linearOperatiors.includes(node.operationKind) &&
				(node.explanation[0]?.dottedName === searchedName ||
					node.explanation[1]?.dottedName === searchedName)
			) {
				return numberFieldRequired;
			} // Following reference like this is fragile. We could follow all references
			// but would need some special handling for the dependency on parent.
			// For now this works well enough.
			else if (node.nodeKind === 'reference' && namesToFollow.includes(node.name)) {
				return [...acc, ...findAllComparaisonsValue(node.dottedName, { searchedName, unit })];
			}
		};

		return reduceAST(accumulateThresholds, [], engineBis.getRule(dottedName));
	}
</script>

<script lang="ts">
	import { publicodeSituation, revenuFiscal } from '$lib/stores';
	import type { RuleName } from '@betagouv/aides-velo';
	import { slide } from 'svelte/transition';
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import NumberField from './NumberField.svelte';
	import Question from './Question.svelte';

	export let goals;

	const uniq = (l) => [...new Set(l)];
	const engineBis = getEngine({});
	$: thresholds = (goals ?? $originalNames).flatMap((name) =>
		findAllComparaisonsValue(name, {
			searchedName: 'revenu fiscal de référence par part',
			unit: '€/mois',
		}),
	);

	$: numberFieldIsRequired = thresholds.some(
		(x: number | symbol) => x === numberFieldRequired || x === Infinity,
	);

	$: uniqThresholds =
		!numberFieldIsRequired &&
		uniq(thresholds.filter((x: number) => x !== Infinity).map((x: number) => Math.round(x))).sort(
			(a: number, b: number) => a - b,
		);

	// Not all statically detected thresholds are impactful for the current computation
	// as some of them might be in inactive branches of the computation.
	// We evaluate all the thresholds and only keep the one that induice a change in the result.
	function removeUnecessaryThresholds(thresholds) {
		return [0, ...thresholds]
			.reduce(
				(acc, revenu) => {
					// TODO: we could optimize this calcul which is done 2
					// times : one time in DetailsLine and one time here
					engineBis.setSituation({
						...$publicodeSituation,
						// 'vélo . type': `'${$veloCat}'`,
						// 'maximiser les aides': 'oui',
						// NOTE: we want to show the RFRPP tresholds even if the
						// user is in a situation of handicap.
						'demandeur . en situation de handicap': 'non',
						'revenu fiscal de référence par part': `${revenu + 1} €/mois`,
					});

					// In some cases the total amount of aides will be the same
					// but the repartition will be different, exemple:
					// revenu 1 :  a 100, b 200  (total 300)
					// revenu 2 :  a 300         (total 300)
					// In this case we don't want to filter the threshold #182
					const aidesDisplayed = $originalNames
						.map((dottedName: RuleName) => engineBis.evaluate(dottedName).nodeValue ?? 0)
						.join('-');

					if (aidesDisplayed === acc.dernieresAidesDisplayed) {
						return acc;
					} else {
						return {
							thresholds: [...acc.thresholds, revenu],
							dernieresAidesDisplayed: aidesDisplayed,
						};
					}
				},
				{ thresholds: [], dernieresAidesDisplayed: null },
			)
			.thresholds.slice(1);
	}

	$: displayedThresholds =
		!numberFieldIsRequired &&
		($veloCat ? removeUnecessaryThresholds(uniqThresholds) : uniqThresholds);

	$: if (
		$revenuFiscal &&
		!numberFieldIsRequired &&
		!displayedThresholds.map((threshold) => threshold - 1).includes($revenuFiscal)
	) {
		const closestThreshold = displayedThresholds.find((plafond) => $revenuFiscal <= plafond);
		$revenuFiscal = closestThreshold
			? closestThreshold - 1
			: displayedThresholds[displayedThresholds.length - 1] + 1;
	}

	let showExplanations = false;
</script>

{#if numberFieldIsRequired || displayedThresholds.length > 0}
	<div class="mt-6">
		Quel est votre revenu net mensuel (quotient familial) ? <span
			title="Plus d'informations"
			class="cursor-pointer"
			on:click={() => (showExplanations = !showExplanations)}
			><Emoji className="align-middle" emoji="ℹ" /></span
		>
		{#if showExplanations}
			<p
				class="my-2 text-gray-700 prose-sm border-l-2 rounded-r p-2 bg-gray-50"
				transition:slide={{ duration: 100 }}
			>
				Le montant des aides dépend de votre revenu par part de quotient familial. Sur votre avis
				d'imposition cela correspond au montant du « revenu fiscal de référence » divisé par le
				nombre de parts du quotient familial, puis divisé par 12.
			</p>
		{/if}
		<div class="flex gap-2 mt-2 flex-wrap playwright-revenuoptions">
			{#if numberFieldIsRequired}
				<NumberField bind:value={$revenuFiscal} id="revenu-fiscal" unité="€" />
			{:else}
				{#each displayedThresholds as threshold}
					<MultipleChoiceAnswer value={threshold - 1} bind:group={$revenuFiscal}
						>moins de <strong class="font-semibold"
							>{formatValue(threshold)}
							€</strong
						></MultipleChoiceAnswer
					>
				{/each}
				<MultipleChoiceAnswer
					value={displayedThresholds[displayedThresholds.length - 1] + 1}
					bind:group={$revenuFiscal}
					>plus de <strong class="font-semibold">
						{formatValue(displayedThresholds[displayedThresholds.length - 1] + 1)} €</strong
					></MultipleChoiceAnswer
				>
			{/if}
		</div>
	</div>
{/if}
