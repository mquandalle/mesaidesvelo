<script>
	import { engine, getCurrentBikeEngine } from '$lib/engine';

	import { answers } from '$lib/stores';
	import Question from './Question.svelte';
	import RevenuSelector from './RevenuSelector.svelte';
	export let goals = [];

	answers.set({});

	const questionsOrder = ['revenu fiscal de référence', 'vélo . prix'];

	const getSortOrder = (name) =>
		questionsOrder.includes(name) ? questionsOrder.indexOf(name) : Infinity;
	const uniq = (arr) => [...new Set(arr)];
	const questions = uniq(
		(goals ?? ['aides'])
			.map((ruleName) => $getCurrentBikeEngine().evaluate(ruleName).traversedVariables)
			.flat()
	)
		.filter((q) => engine.getRule(q).rawNode.question)
		.sort((a, b) => getSortOrder(a) - getSortOrder(b));
</script>

<div class="border-l-4 mt-8 border-green-200 pl-4 py-3 bg-green-50">
	<div
		class="inline-block relative -left-8.5 bg-white border-4 border-green-200 w-8 h-8 rounded-full font-bold text-green-300 text-center leading-6"
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
