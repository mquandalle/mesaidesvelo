<script lang="ts">
	import type { QuestionNames } from '$lib/aides-velo-utils';
	import { getEngine } from '$lib/engine';
	import { QUESTIONS_ORDER, QUESTIONS_TO_IGNORE } from '$lib/questions';
	import { getSimulationForm } from '$lib/simulation/context.svelte';
	import type { RuleName } from 'aides-velo';
	import Question from './Question.svelte';
	import RevenuSelector from './RevenuSelector.svelte';

	interface Props {
		goals?: any;
		veloEtat?: string;
	}

	let { goals = undefined, veloEtat = 'neuf' }: Props = $props();
	const form = getSimulationForm();

	let engine = $derived(
		getEngine({
			...form.publicodeSituation,
			...(form.veloTypeValue ? { 'vélo . type': form.veloTypeValue } : {}),
			'vélo . état': `'${veloEtat}'`,
		}),
	);

	const getSortOrder = (name: RuleName) =>
		QUESTIONS_ORDER.includes(name) ? QUESTIONS_ORDER.indexOf(name) : Infinity;

	const uniq = <T,>(arr: T[]) => [...new Set(arr)];
	let questions = $derived(
		(
			uniq(
				(goals ?? ['aides . montant'])
					.map((ruleName: RuleName) => engine.evaluate(ruleName).traversedVariables)
					?.flat(),
			) as RuleName[]
		)
			.filter(
				(q: RuleName) =>
					engine.getRule(q).rawNode.question || 'revenu fiscal de référence par part' === q,
			)
			.filter((q) => !QUESTIONS_TO_IGNORE.includes(q as QuestionNames))
			.sort((a, b) => getSortOrder(a) - getSortOrder(b)),
	);
</script>

{#if questions?.length > 0}
	<section class="mt-6 border-l-4 border-[#86efac] py-4 pl-4">
		<p class="text-base italic text-[#647085]">
			Répondez {#if questions.length === 1}à la question{:else}aux questions{/if} pour calculer l'aide
			:
		</p>
		{#each questions as question}
			{#if question === 'revenu fiscal de référence par part'}
				<RevenuSelector {goals} />
			{:else}
				{#key question}
					<!-- NOTE: needed to avoid dissociated question and values -->
					<Question rule={question} {engine} />
				{/key}
			{/if}
		{/each}
	</section>
{/if}
