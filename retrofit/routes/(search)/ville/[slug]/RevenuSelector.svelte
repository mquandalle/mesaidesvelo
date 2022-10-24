<script>
	import Emoji from '$lib/components/Emoji.svelte';
	import MultipleChoiceAnswer from '$lib/components/MultipleChoiceAnswer.svelte';
	import { revenuFiscal } from '$lib/stores';
	import { formatValue, reduceAST } from 'publicodes';
	import { slide } from 'svelte/transition';
	import { engine } from '$lib/engine';

	export let goals = [];

	function findAllComparaisonsValue(dottedName, { searchedName, unit }) {
		const comparaisonOperators = ['<', '<=', '>', '>='];

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

	let showExplanations = false;

	const uniq = (l) => [...new Set(l)];

	$: displayedThresholds = uniq(
		goals
			.flatMap((name) =>
				findAllComparaisonsValue(name, {
					searchedName: 'revenu fiscal de référence',
					unit: '€/mois',
				})
			)
			.filter((x) => x !== Infinity)
			.map((x) => Math.round(x))
	).sort((a, b) => a - b);
</script>

<div class="mt-6">
	Quel est votre revenu net mensuel (quotient familial) ? <span
		title="Plus d’informations"
		class="cursor-pointer"
		on:click={() => (showExplanations = !showExplanations)}><Emoji emoji="ℹ" /></span
	>
	{#if showExplanations}
		<p class="m-4 mt-2 text-gray-600 text-sm" transition:slide|local={{ duration: 100 }}>
			Le montant des aides dépend de votre revenu par part de quotient familial. Sur votre avis
			d'imposition cela correspond au montant du « revenu fiscal de référence » divisé par le nombre
			de parts du quotient familial, puis divisé par 12.
		</p>
	{/if}
	<div class="flex gap-2 mt-2 flex-wrap playwright-revenuoptions">
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
	</div>
</div>
