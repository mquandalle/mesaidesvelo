<script>
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import DetailsLine from './DetailsLine.svelte';
	import Emoji from './Emoji.svelte';
	import { emoji, title } from './Results.svelte';
	import { engine, getCurrentBikeEngine } from '$lib/engine';
	import Questions from './Questions.svelte';
	import AnimatedAmount from './AnimatedAmount.svelte';

	const veloCat = $page.url.searchParams.get('velo');
	const categoryDescription = engine.getRule(`vélo . ${veloCat}`).rawNode?.description ?? '';

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	$: aidesDetails = collectivites
		.map((collectivite) => {
			const aide = $getCurrentBikeEngine().evaluate(`aides . ${collectivite}`);
			if (!aide.nodeValue) {
				return null;
			}
			const originalRuleName = aide.explanation.find(({ condition }) => condition.isActive)
				.consequence.name;

			return originalRuleName;
		})
		.filter(Boolean);

	$: sum = $getCurrentBikeEngine().evaluate('aides');
</script>

<div class="mt-8" />

<a
	class="inline-block text-gray-500 text-md 
    cursor-pointer
    hover:text-green-700 transform transition hover:-translate-x-1"
	sveltekit:noscroll
	href={$page.url.pathname}
>
	← Toutes les aides
</a>
<h2 class="font-bold mt-2 mb-5 text-gray-900 text-xl">
	{title(veloCat)}{#if emoji(veloCat)}&nbsp;<Emoji emoji={emoji(veloCat)} />{/if}
</h2>

{#if categoryDescription}
	<p class="text-gray-700 text-sm">{categoryDescription}</p>
{/if}

<div class="border mt-6 bg-white rounded-md shadow-sm">
	{#each aidesDetails as ruleName (ruleName)}
		<div transition:slide|local={{ duration: 200 }} class="border-b last:border-b-0">
			<DetailsLine {ruleName} {veloCat} />
		</div>
	{/each}
	<div class="py-4 px-3 sm:px-4 bg-gray-50 rounded-b-md">
		<div class="flex justify-between text-lg">
			<h3 class="font-semibold text-md">Total des aides</h3>
			<div class="font-bold"><AnimatedAmount amount={sum.nodeValue} unit={sum.unit} /></div>
		</div>
		{#if false}
			<div class="flex justify-between text-lg mt-3 text-gray-600" transition:slide|local>
				<h3 class="font-semibold text-sm">Reste à charge</h3>
				<div class="font-semibold text-sm">XXX €</div>
			</div>
		{/if}
	</div>
</div>

<Questions goals={aidesDetails} />
