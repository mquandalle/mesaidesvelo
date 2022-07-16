<script>
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import { engine, optionalEvaluate } from '$lib/engine';
	import { answers } from '$lib/stores';
	import { slugify } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import Emoji from './Emoji.svelte';
	import NumberField from './NumberField.svelte';

	export let rule;

	const rawRule = engine.getRule(rule).rawNode;
	const { question, unité, type, description } = rawRule;
	const domId = `question-${slugify(rule)}`;

	let value = '';

	$: $answers[rule] = value && `${value} ${unité || ''}`.trim();

	let showExplanations = false;
</script>

<div class="flex flex-col mt-6 items-start">
	<span
		><label for={domId}>{optionalEvaluate(question)?.replace(/\s+?$/, '\u00A0?')}</label>
		{#if description}
			<span
				title="Plus d’informations"
				class="cursor-pointer"
				on:click={() => (showExplanations = !showExplanations)}><Emoji emoji="ℹ" /></span
			>
			{#if showExplanations}
				<p class="m-4 mt-2 text-gray-600 text-sm" transition:slide|local={{ duration: 100 }}>
					{@html description}
				</p>
			{/if}
		{/if}
	</span>
	{#if type === 'booléen'}
		<div class="flex gap-2 mt-2 flex-wrap">
			<MultipleChoiceAnswer value="oui" bind:group={value}>Oui</MultipleChoiceAnswer>
			<MultipleChoiceAnswer value="non" bind:group={value}>Non</MultipleChoiceAnswer>
		</div>
	{:else}
		<NumberField bind:value {unité} id={domId} />
	{/if}
</div>
