<script lang="ts">
	import { getEngine } from '$lib/engine';
	import type { QuestionNames } from '$lib/aides-velo-utils';
	import { publicodeSituation, veloTypeValue } from '$lib/stores';
	import Question from './Question.svelte';
	import RevenuSelector from './RevenuSelector.svelte';
	import type { RuleName } from '@betagouv/aides-velo';

	const QUESTIONS_TO_IGNORE: QuestionNames[] = [
		// Ignored as they are automatically resolved
		'localisation . ZFE',
		'localisation . epci',
		'localisation . pays',
		'localisation . région',
		'localisation . code insee',
		'localisation . département',
		'vélo . type',
		// Ignored as the 'revenu fiscal de référence par part' is
		// directly asked.
		'revenu fiscal de référence par part . nombre de parts',
		'revenu fiscal de référence par part . revenu de référence',
		// Not relevant to expose to the user, it's used for internal
		// computation.
		'vélo . état',
	];
	const QUESTIONS_ORDER: RuleName[] = [
		// NOTE: this is no longer a question in the model as it's
		// computed from 'revenu fiscal de référence par part . revenu
		// de référence' 'revenu fiscal de référence par part . nombre
		// de parts'. However, to match the previous behavior, we ask
		// directly the question to the user, maybe we should change
		// this to ask separately the number of parts and the revenu.
		'revenu fiscal de référence par part',
		'demandeur . en situation de handicap',
		'vélo . prix',
	];

	export let goals = undefined;

	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': $veloTypeValue,
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
				<!-- NOTE: needed to avoid dissociated question and values -->
				{#key question}
					<Question rule={question} />
				{/key}
			{/if}
		{/each}
	</div>
{/if}
