<script>
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import { engine, optionalEvaluate } from '$lib/engine';
	import { answers } from '$lib/stores';
	import { slugify } from '$lib/utils';

	export let rule;

	const rawRule = engine.getRule(rule).rawNode;
	const { question, unité, type } = rawRule;
	const domId = `question-${slugify(rule)}`;

	let value = '';

	$: $answers[rule] = value && `${value} ${unité || ''}`.trim();
</script>

<div class="flex flex-col mt-6 items-start">
	<label for={domId}>{optionalEvaluate(question)?.replace(/\s+?$/, '\u00A0?')}</label>
	{#if type === 'booléen'}
		<div class="flex gap-2 mt-2 flex-wrap">
			<MultipleChoiceAnswer value="oui" bind:group={value}>Oui</MultipleChoiceAnswer>
			<MultipleChoiceAnswer value="non" bind:group={value}>Non</MultipleChoiceAnswer>
		</div>
	{:else}
		<div class="border rounded p-2 mt-1 bg-white shadow-sm">
			<input
				type="number"
				id={domId}
				class="m-0 text-right w-35 focus:outline-transparent"
				bind:value
			/>
			<label for={domId}><span class="text-gray-600">{unité || ''}</span></label>
		</div>
	{/if}
</div>

<style>
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
