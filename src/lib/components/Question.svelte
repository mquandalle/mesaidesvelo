<script lang="ts">
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import SvelteMarkdown from '@modal-labs/svelte-markdown';
	import { answers, publicodeSituation } from '$lib/stores';
	import { slugify, nodeValueToOuiNon } from '$lib/utils';
	import { getOptions } from '$lib/aides-velo-utils';
	import { slide } from 'svelte/transition';
	import Emoji from './Emoji.svelte';
	import NumberField from './NumberField.svelte';
	import { engine as baseEngine } from '$lib/engine';

	let { rule, engine } = $props();

	// svelte-ignore state_referenced_locally
	let value = $state(
		$publicodeSituation[rule] ?? nodeValueToOuiNon(engine.evaluate(rule).nodeValue),
	);

	let ruleNode = $derived(baseEngine.getRule(rule));
	let ruleInfos = $derived(ruleNode.rawNode);
	let possibilités = $derived(getOptions(rule));
	let domId = $derived(`question-${slugify(rule)}`);
	let ruleType = $derived(baseEngine.context.nodesTypes.get(ruleNode)?.type);

	function setValue(nextValue) {
		value = nextValue;
		if (nextValue) {
			answers.update(($answers) => ({
				...$answers,
				[rule]: possibilités?.includes(nextValue)
					? `'${nextValue}'`
					: // NOTE: we don't use unité here anymore as we don't
						// really need it for now and it was causing some
						// issues when retrieving it from the situation and
						// therefore duplicating the unit.
						nextValue,
			}));
		} else if (nextValue === null) {
			answers.update(($answers) => ({ ...$answers, [rule]: undefined }));
		}
	}

	function optionalEvaluate(expression) {
		if (typeof expression === 'string') {
			return expression;
		} else {
			return engine.evaluate(expression).nodeValue;
		}
	}

	let showExplanations = $state(false);
</script>

<div class="flex flex-col mt-6 items-start">
	<span
		><label for={domId}>{optionalEvaluate(ruleInfos.question)?.replace(/\s+?$/, '\u00A0?')}</label>
		{#if ruleInfos.description}
			<button
				title="Plus d'informations"
				class="cursor-pointer"
				onclick={() => (showExplanations = !showExplanations)}
				><Emoji className="align-middle" emoji="ℹ" />
			</button>
			{#if showExplanations}
				<p
					class="my-2 text-gray-700 prose-sm border-l-2 rounded-r p-2 bg-gray-50"
					transition:slide={{ duration: 100 }}
				>
					<SvelteMarkdown source={ruleInfos.description} />
				</p>
			{/if}
		{/if}
	</span>

	{#if ruleType === 'boolean'}
		<div class="flex gap-2 mt-2 flex-wrap">
			<MultipleChoiceAnswer value="oui" group={value} onSelect={setValue}>Oui</MultipleChoiceAnswer>
			<MultipleChoiceAnswer value="non" group={value} onSelect={setValue}>Non</MultipleChoiceAnswer>
		</div>
	{:else if possibilités?.length > 0}
		<div class="flex gap-2 mt-2 flex-wrap">
			{#each possibilités as possibilité (possibilité)}
				<MultipleChoiceAnswer value={`'${possibilité}'`} group={value} onSelect={setValue}
					>{engine.getRule(rule + ' . ' + possibilité).rawNode.titre ??
						possibilité}</MultipleChoiceAnswer
				>
			{/each}
		</div>
	{:else}
		<NumberField id={domId} unité={ruleInfos.unité} bind:value={() => value, setValue} />
	{/if}
</div>
