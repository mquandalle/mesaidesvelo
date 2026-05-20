<script lang="ts">
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import SvelteMarkdown from '@modal-labs/svelte-markdown';
	import { getSimulationForm } from '$lib/simulation/context.svelte';
	import { slugify, nodeValueToOuiNon } from '$lib/utils';
	import { getOptions } from '$lib/aides-velo-utils';
	import { slide } from 'svelte/transition';
	import Emoji from './Emoji.svelte';
	import NumberField from './NumberField.svelte';
	import { engine as baseEngine } from '$lib/engine';

	let { rule, engine } = $props();
	const form = getSimulationForm();

	let value = $derived(form.getAnswer(rule) ?? nodeValueToOuiNon(engine.evaluate(rule).nodeValue));

	let ruleNode = $derived(baseEngine.getRule(rule));
	let ruleInfos = $derived(ruleNode.rawNode);
	let possibilités = $derived(getOptions(rule));
	let domId = $derived(`question-${slugify(rule)}`);
	let ruleType = $derived(baseEngine.context.nodesTypes.get(ruleNode)?.type);

	function setValue(nextValue: string | number | null) {
		// NOTE: we don't use unité here anymore as we don't really need it for now
		// and it was causing issues when retrieving it from the situation.
		form.setAnswer(rule, nextValue);
	}

	function optionalEvaluate(expression: any) {
		if (typeof expression === 'string') {
			return expression;
		} else {
			return engine.evaluate(expression).nodeValue;
		}
	}

	function getNumberValue() {
		return typeof value === 'number' ? value : null;
	}

	let showExplanations = $state(false);
</script>

<div class="mt-6 flex flex-col items-start">
	<span class="text-sm font-bold text-[#263754]"
		><label for={domId}>{optionalEvaluate(ruleInfos.question)?.replace(/\s+?$/, '\u00A0?')}</label>
		{#if ruleInfos.description}
			<button
				title="Plus d'informations"
				class="ml-1 cursor-pointer align-middle opacity-75 hover:opacity-100"
				onclick={() => (showExplanations = !showExplanations)}
				><Emoji className="align-middle" emoji="ℹ" />
			</button>
			{#if showExplanations}
				<p
					class="my-3 rounded-lg border border-[#dfe6ef] bg-[#fbfcfb] p-3 text-sm font-normal leading-6 text-[#647085] prose-sm"
					transition:slide={{ duration: 100 }}
				>
					<SvelteMarkdown source={ruleInfos.description} />
				</p>
			{/if}
		{/if}
	</span>

	{#if ruleType === 'boolean'}
		<div class="mt-3 flex flex-wrap gap-2">
			<MultipleChoiceAnswer value="oui" group={value} onSelect={setValue}>Oui</MultipleChoiceAnswer>
			<MultipleChoiceAnswer value="non" group={value} onSelect={setValue}>Non</MultipleChoiceAnswer>
		</div>
	{:else if (possibilités?.length ?? 0) > 0}
		<div class="mt-3 flex flex-wrap gap-2">
			{#each possibilités as possibilité (possibilité)}
				<MultipleChoiceAnswer value={`'${possibilité}'`} group={value} onSelect={setValue}
					>{engine.getRule(rule + ' . ' + possibilité).rawNode.titre ??
						possibilité}</MultipleChoiceAnswer
				>
			{/each}
		</div>
	{:else}
		<NumberField id={domId} unité={ruleInfos.unité} bind:value={getNumberValue, setValue} />
	{/if}
</div>
