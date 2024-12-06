<script>
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import { answers, publicodeSituation, veloTypeValue } from '$lib/stores';
	import { slugify } from '$lib/utils';
	import { getOptions } from '$lib/aides-velo-utils';
	import { slide } from 'svelte/transition';
	import Emoji from './Emoji.svelte';
	import NumberField from './NumberField.svelte';
	import { engine as baseEngine, getEngine } from '$lib/engine';

	export let rule;

	let value = $publicodeSituation[rule] ?? '';

	$: ruleInfos = baseEngine.getRule(rule).rawNode;
	$: possibilités = getOptions(rule);
	$: domId = `question-${slugify(rule)}`;
	$: ruleParent = rule.split(' . ').slice(0, -1).join(' . ');

	$: if (value) {
		$answers[rule] = possibilités?.includes(value)
			? `'${value}'`
			: // NOTE: we don't use unité here anymore as we don't
				// really need it for now and it was causing some
				// issues when retrieving it from the situation and
				// therefore duplicating the unit.
				value;
	} else if (value === null) {
		$answers[rule] = undefined;
	}

	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': $veloTypeValue,
	});
	$: optionalEvaluate = (expression) => {
		if (typeof expression === 'string') {
			return expression;
		} else {
			return engine.evaluate(expression).nodeValue;
		}
	};

	let showExplanations = false;
</script>

<div class="flex flex-col mt-6 items-start">
	<span
		><label for={domId}>{optionalEvaluate(ruleInfos.question)?.replace(/\s+?$/, '\u00A0?')}</label>
		{#if ruleInfos.description}
			<button
				title="Plus d’informations"
				class="cursor-pointer"
				on:click={() => (showExplanations = !showExplanations)}
				><Emoji emoji="ℹ" />
			</button>
			{#if showExplanations}
				<p class="m-4 mt-2 text-gray-600 text-sm" transition:slide={{ duration: 100 }}>
					{@html ruleInfos.description}
				</p>
			{/if}
		{/if}
	</span>

	{#if ruleInfos.type === 'booléen'}
		<div class="flex gap-2 mt-2 flex-wrap">
			<MultipleChoiceAnswer value="oui" bind:group={value}>Oui</MultipleChoiceAnswer>
			<MultipleChoiceAnswer value="non" bind:group={value}>Non</MultipleChoiceAnswer>
		</div>
	{:else if possibilités?.length > 0}
		<div class="flex gap-2 mt-2 flex-wrap">
			{#each possibilités as possibilité}
				<MultipleChoiceAnswer value={possibilité} bind:group={value}
					>{engine.getRule(ruleParent + ' . ' + possibilité).rawNode.titre ??
						possibilité}</MultipleChoiceAnswer
				>
			{/each}
		</div>
	{:else}
		<NumberField bind:value unité={ruleInfos.unité} id={domId} />
	{/if}
</div>
