<script context="module">
	import { engine } from '$lib/engine';
	import { formatValue, reduceAST } from 'publicodes';
	import { derived } from 'svelte/store';
	import { localisationSituation, veloCat } from '$lib/stores';
	import Emoji from './Emoji.svelte';

	// In case the formula involve a “linear operation” such as additions or
	// product, we cannot extract a fixed set a threshold and we need to display
	// a input of type number.
	const numberFieldRequired = Symbol('number field required');

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	const bikeKinds = engine?.getRule('vélo . type').rawNode['possibilités'];
	const uniq = (arr) => [...new Set(arr)];

	const engineBis = engine.shallowCopy();
	export const originalNames = derived([localisationSituation], ([$localisationSituation]) => {
		if (!localisationSituation) {
			return [];
		}
		return uniq(
			bikeKinds
				.map((veloCat) => {
					engineBis.setSituation({
						...$localisationSituation,
						// 'maximiser les aides': 'oui',
						// 'vélo . type': `'${veloCat}'`,
					});

					const originalNames = collectivites
						.map((collectivite) => {
							const aide = engineBis.evaluate(`aides . ${collectivite}`);
							if (!aide.nodeValue) {
								return null;
							}
							const originalRuleName = aide.explanation.find(
								({ condition }) => condition.nodeValue === true,
							).consequence.name;

							return originalRuleName;
						})
						.filter(Boolean);

					return originalNames;
				})
				.flat(),
		);
	});

	// We do a static analysis of the rules AST to search for a particular rule name.
	// When in find it in a comparaison expression we retreive the value of the other
	// side of the expression.
	// For exemple in: applicable si: my . rule <= 400 €
	// We will retrieve [400]
	// We also need to handle mechanisms that are implemented using comparaisons such
	// as “grille” or “barème”.
	function findAllComparaisonsValue(dottedName, { searchedName, unit }) {
		const comparaisonOperators = ['<', '<=', '>', '>='];
		const linearOperatiors = ['-', '+', '*', '/'];

		// TODO: There might be a better way to convert a parsed node into a given unit.
		const convertValue = (node) => {
			const valeur = formatValue(engine.evaluate(node)).replace(/\s/g, '');
			if (valeur === '∞') {
				return Infinity;
			}
			return engine.evaluate({ valeur, unité: unit }).nodeValue;
		};

		const namesToFollow = ['ménage imposable', 'personnes dans le foyer fiscal'];

		const accumulateThresholds = (acc, node) => {
			if (acc === numberFieldRequired) {
				return numberFieldRequired;
			}

			if (node.nodeKind === 'grille' && node.explanation.assiette?.dottedName === searchedName) {
				const thresholds = node.explanation.tranches.map(({ plafond }) => convertValue(plafond));
				return [...acc, ...thresholds];
			} else if (
				node.nodeKind === 'operation' &&
				comparaisonOperators.includes(node.operationKind)
			) {
				if (node.explanation[0]?.dottedName === searchedName) {
					return [...acc, convertValue(node.explanation[1])];
				} else if (node.explanation[1]?.dottedName === searchedName) {
					return [...acc, convertValue(node.explanation[0])];
				}
			} else if (
				node.nodeKind === 'operation' &&
				linearOperatiors.includes(node.operationKind) &&
				(node.explanation[0]?.dottedName === searchedName ||
					node.explanation[1]?.dottedName === searchedName)
			) {
				return numberFieldRequired;
			}
			// Following reference like this is fragile. We could follow all references
			// but would need some special handling for the dependency on parent.
			// For now this works well enough.
			else if (node.nodeKind === 'reference' && namesToFollow.includes(node.name)) {
				return [...acc, ...findAllComparaisonsValue(node.dottedName, { searchedName, unit })];
			}
		};

		return reduceAST(accumulateThresholds, [], engine.getRule(dottedName));
	}
</script>

<script>
	import { publicodeSituation, revenuFiscal } from '$lib/stores';
	import { slide } from 'svelte/transition';
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import NumberField from './NumberField.svelte';

	export let goals;

	const uniq = (l) => [...new Set(l)];
	$: tresholds = (goals ?? $originalNames).flatMap((name) =>
		findAllComparaisonsValue(name, {
			searchedName: 'revenu fiscal de référence',
			unit: '€/mois',
		}),
	);

	$: numberFieldIsRequired = tresholds.includes(numberFieldRequired);

	$: uniqThresholds =
		!numberFieldIsRequired &&
		uniq(tresholds.filter((x) => x !== Infinity).map((x) => Math.round(x))).sort((a, b) => a - b);

	const engineBis = engine.shallowCopy();

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
						'revenu fiscal de référence': `${revenu + 1} €/mois`,
					});

					// In some cases the total amount of aides will be the same
					// but the repartition will be different, exemple:
					// revenu 1 :  a 100, b 200  (total 300)
					// revenu 2 :  a 300         (total 300)
					// In this case we don't want to filter the threshold #182
					const aidesDisplayed = $originalNames
						.map((dottedName) => engineBis.evaluate(dottedName).nodeValue ?? 0)
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
			title="Plus d’informations"
			class="cursor-pointer"
			on:click={() => (showExplanations = !showExplanations)}><Emoji emoji="ℹ" /></span
		>
		{#if showExplanations}
			<p class="m-4 mt-2 text-gray-600 text-sm" transition:slide={{ duration: 100 }}>
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
						>moins de <strong class="font-semibold">{formatValue(threshold)} €</strong
						></MultipleChoiceAnswer
					>
				{/each}
				<MultipleChoiceAnswer
					value={displayedThresholds[displayedThresholds.length - 1] + 1}
					bind:group={$revenuFiscal}
					>plus de <strong class="font-semibold"
						>{formatValue(displayedThresholds[displayedThresholds.length - 1] + 1)} €</strong
					></MultipleChoiceAnswer
				>
			{/if}
		</div>
	</div>
{/if}
