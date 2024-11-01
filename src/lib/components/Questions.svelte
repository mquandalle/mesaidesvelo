<script>
	import { getEngine } from '$lib/engine';
	import { publicodeSituation, veloCat } from '$lib/stores';
	import Question from './Question.svelte';
	import RevenuSelector from './RevenuSelector.svelte';

	export let goals = undefined;


	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': `'${$veloCat}'`,
	});

	const questionsOrder = ['revenu fiscal de référence par part', 'vélo . prix'];
	const questionsToIgnore = [
		'vélo . type',
		'vélo . état',
		'localisation . code insee',
		'localisation . epci',
		'localisation . ZFE',
		'localisation . département',
		'localisation . région',
		'localisation . pays',
		'revenu fiscal de référence par part . nombre de parts'];

	const getSortOrder = (name) =>
		questionsOrder.includes(name) ? questionsOrder.indexOf(name) : Infinity;
	const uniq = (arr) => [...new Set(arr)];
	$: questions = uniq(
		(goals ?? ['aides . montant'])
			.map((ruleName) => engine.evaluate(ruleName).traversedVariables)
			.flat(),
	)
		.filter((q) => engine.getRule(q).rawNode.question)
		.filter((q) => !questionsToIgnore.includes(q))
		.sort((a, b) => getSortOrder(a) - getSortOrder(b));

</script>

{#if questions?.length > 0}
	<div class="border-l-4 border-green-200 pl-4 py-4 ml-4">
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
			{#if question === 'revenu fiscal de référence par part . revenu de référence'}
				<RevenuSelector {goals} />
			{:else}
				<Question rule={question} />
			{/if}
		{/each}
	</div>
{/if}
