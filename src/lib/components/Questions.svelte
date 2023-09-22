<script>
	import { getEngine } from '$lib/engine';
	import { publicodeSituation, veloCat } from '$lib/stores';
	import Question from './Question.svelte';
	import RevenuSelector from './RevenuSelector.svelte';

	export let goals;
	export let demandeNeufOuOccasion = false;

	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': `'${$veloCat}'`,
	});

	const questionsOrder = ['revenu fiscal de référence', 'vélo . prix'];

	const getSortOrder = (name) =>
		questionsOrder.includes(name) ? questionsOrder.indexOf(name) : Infinity;
	const uniq = (arr) => [...new Set(arr)];
	$: questions = uniq(
		(goals ?? ['aides . montant'])
			.map((ruleName) => engine.evaluate(ruleName).traversedVariables)
			.flat()
	)
		.filter((q) => engine.getRule(q).rawNode.question)
		.filter((q) => q !== 'vélo . neuf ou occasion')
		.sort((a, b) => getSortOrder(a) - getSortOrder(b));

	if (demandeNeufOuOccasion) {
		questions?.unshift('vélo . neuf ou occasion');
	}
</script>

{#if questions?.length > 0}
	<div class="border-l-4 border-dark-800 pl-4 py-4 ml-4">
		<div
		class="inline-block relative -left-8 bg-white border-4 border-dark-900 w-8 h-8 rounded-full font-bold text-dark-900 text-center leading-6"
	>
		€
	</div>
		<p class="text-gray-600 text-md -mt-7 pl-3 italic">
			Répondez {#if questions.length === 1}à la question{:else}aux questions{/if} pour calculer l’aide
			:
		</p>
		{#each questions as question}
			{#if question === 'revenu fiscal de référence'}
				<RevenuSelector {goals} />
			{:else}
				<Question rule={question} />
			{/if}
		{/each}
	</div>
{/if}
