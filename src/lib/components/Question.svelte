<script>
	import MultipleChoiceAnswer from './MultipleChoiceAnswer.svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { answers, publicodeSituation } from '$lib/stores';
	import { slugify, nodeValueToOuiNon } from '$lib/utils';
	import { getOptions } from '$lib/aides-velo-utils';
	import { slide } from 'svelte/transition';
	import Emoji from './Emoji.svelte';
	import NumberField from './NumberField.svelte';
	import { engine as baseEngine } from '$lib/engine';

	export let rule;
	export let engine;

	let value = $publicodeSituation[rule] ?? nodeValueToOuiNon(engine.evaluate(rule).nodeValue);

	$: ruleNode = baseEngine.getRule(rule);
	$: ruleInfos = ruleNode.rawNode;
	$: possibilités = getOptions(rule);
	$: domId = `question-${slugify(rule)}`;
	$: ruleType = baseEngine.context.nodesTypes.get(ruleNode)?.type;

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
				title="Plus d'informations"
				class="cursor-pointer"
				on:click={() => (showExplanations = !showExplanations)}
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
			<MultipleChoiceAnswer value="oui" bind:group={value}>Oui</MultipleChoiceAnswer>
			<MultipleChoiceAnswer value="non" bind:group={value}>Non</MultipleChoiceAnswer>
		</div>
	{:else if possibilités?.length > 0}
		<div class="flex gap-2 mt-2 flex-wrap">
			{#each possibilités as possibilité}
				<MultipleChoiceAnswer value={`'${possibilité}'`} bind:group={value}
					>{engine.getRule(rule + ' . ' + possibilité).rawNode.titre ??
						possibilité}</MultipleChoiceAnswer
				>
			{/each}
		</div>
	{:else}
		<NumberField id={domId} unité={ruleInfos.unité} bind:value />
	{/if}
</div>
