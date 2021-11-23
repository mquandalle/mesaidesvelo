<script context="module">
	import { engine } from '$lib/components/Results.svelte';
	import Emoji from './Emoji.svelte';
	import { formatValue, reduceAST } from 'publicodes';

	// We do a static analysis of the rules AST to search for a particular rule name.
	// When in find it in a comparaison expression we retreive the value of the other
	// side of the expression.
	// For exemple in: applicable si: my . rule <= 400 €
	// We will retrieve [400]
	// We also need to handle mechanisms that are implemented using comparaisons such
	// as “grille” or “barème”.
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
				// Following reference like this is fragile. We could follow all references
				// but would need some special handling for the dependency on parent.
				// For now this works well enough.
			} else if (node.nodeKind === 'reference' && node.name === 'ménage imposable') {
				return [...acc, ...findAllComparaisonsValue(node.dottedName, { searchedName, unit })];
			}
		};

		return reduceAST(accumulateThresholds, [], engine.getRule(dottedName));
	}
</script>

<script>
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import { slide } from 'svelte/transition';

	export let rules;
	export let value;

	const uniq = (l) => [...new Set(l)];
	const thresholds = uniq(
		rules
			.map((name) =>
				findAllComparaisonsValue(name, { searchedName: 'revenu fiscal de référence', unit: '€/an' })
			)
			.flat()
			.filter((x) => x !== Infinity)
	).sort((a, b) => a - b);

	// Not all statically detected thresholds are impactful for the current computation
	// as some of them might be in inactive branches of the computation.
	// We evaluate all the thresholds and only keep the one that induice a change in the result.
	const engineBis = engine.shallowCopy();
	const displayedThresholds = [0, ...thresholds]
		.reduce(
			(acc, revenu) => {
				engineBis.setSituation({
					...engine.parsedSituation,
					'revenu fiscal de référence': `${revenu + 1} €/an`
				});
				const montantAides = engineBis.evaluate('aides').nodeValue;
				if (montantAides === acc.dernierMontant) {
					return acc;
				} else {
					return {
						thresholds: [...acc.thresholds, revenu],
						dernierMontant: montantAides
					};
				}
			},
			{ thresholds: [], dernierMontant: null }
		)
		.thresholds.slice(1);

	let showExplanations = false;
</script>

{#if displayedThresholds.length > 0}
	<div class="mt-6">
		Votre revenu annuel (quotient familial) : <span
			title="Plus d’informations"
			class="cursor-pointer"
			on:click={() => (showExplanations = !showExplanations)}><Emoji emoji="ℹ" /></span
		>
		{#if showExplanations}
			<p class="m-4 mt-2 text-gray-600 text-sm" transition:slide|local={{ duration: 100 }}>
				Le montant des aides dépend de votre revenu par part de quotient familial. Sur votre avis
				d'imposition cela correspond au montant du « revenu fiscal de référence » divisé par le
				nombre de parts du quotient familial.
			</p>
		{/if}
		<div class="flex gap-2 mt-2 flex-wrap">
			{#each displayedThresholds as threshold}
				<MultipleChoiceAnswer value={threshold - 1} bind:group={value}
					>moins de <strong class="font-semibold">{formatValue(threshold)} €</strong
					></MultipleChoiceAnswer
				>
			{/each}
			<MultipleChoiceAnswer
				value={displayedThresholds[displayedThresholds.length - 1] + 1}
				bind:group={value}
				>plus de <strong class="font-semibold"
					>{formatValue(displayedThresholds[displayedThresholds.length - 1] + 1)} €</strong
				></MultipleChoiceAnswer
			>
		</div>
	</div>
{/if}
