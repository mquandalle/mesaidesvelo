<script lang="ts">
	import type { QuestionNames } from '$lib/aides-velo-utils';
	import { getEngine } from '$lib/engine';
	import { QUESTIONS_ORDER, QUESTIONS_TO_IGNORE } from '$lib/questions';
	import { publicodeSituation, veloTypeValue } from '$lib/stores';
	import type { RuleName } from '@betagouv/aides-velo';
	import Question from './Question.svelte';
	import RevenuSelector from './RevenuSelector.svelte';

	export let goals = undefined;
	export let veloEtat = 'neuf';

	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': $veloTypeValue,
		'vélo . état': `'${veloEtat}'`,
	});

	const getSortOrder = (name: QuestionNames) =>
		QUESTIONS_ORDER.includes(name) ? QUESTIONS_ORDER.indexOf(name) : Infinity;

	const uniq = <T,>(arr: T[]) => [...new Set(arr)];
	$: questions = uniq(
		(goals ?? ['aides . montant'])
			.map((ruleName: RuleName) => engine.evaluate(ruleName).traversedVariables)
			?.flat(),
	)
		.filter(
			(q: RuleName) =>
				engine.getRule(q).rawNode.question || 'revenu fiscal de référence par part' === q,
		)
		.filter((q: QuestionNames) => !QUESTIONS_TO_IGNORE.includes(q))
		.sort((a: QuestionNames, b: QuestionNames) => getSortOrder(a) - getSortOrder(b));
</script>

{#if questions?.length > 0}
	<div class="border-l-4 border-green-200 pl-4 py-4 ml-4">
		<div
			class="inline-block relative -left-8.5 bg-white border-4 border-green-200 w-8 h-8 rounded-full font-bold text-green-300 text-center leading-6"
		>
			€
		</div>
		<p class="text-gray-600 text-md -mt-7 pl-3 italic">
			Répondez {#if questions.length === 1}à la question{:else}aux questions{/if} pour calculer l'aide
			:
		</p>
		{#each questions as question}
			{#if question === 'revenu fiscal de référence par part'}
				<RevenuSelector {goals} />
			{:else if question !== 'revenu fiscal de référence par part'}
				{#key question}
					<!-- NOTE: needed to avoid dissociated question and values -->
					<Question rule={question} {engine} />
				{/key}
			{/if}
		{/each}
	</div>
{/if}
