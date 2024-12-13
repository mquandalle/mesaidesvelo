<script>
	import { page } from '$app/stores';
	import AnimatedAmount from '$lib/components/AnimatedAmount.svelte';
	import DetailsLine from '$lib/components/DetailsLine.svelte';
	import Emoji from '$lib/components/Emoji.svelte';
	import Questions from '$lib/components/Questions.svelte';
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { publicodeSituation, resetAnswers, veloTypeValue, veloCat } from '$lib/stores';
	import { emojiCategory, titleCategory } from '$lib/utils';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	resetAnswers();
	$: neufOuOccasion = writable('neuf');
	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': $veloTypeValue,
		'vélo . état': `'${$neufOuOccasion}'`,
	});

	const categoryDescription = baseEngine.getRule(`vélo . ${$veloCat}`).rawNode?.description ?? '';

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	$: aidesDetails =
		$publicodeSituation &&
		collectivites
			.map((collectivite) => {
				const aide = engine
					// .setSituation({
					// 	...$publicodeSituation,
					// 	'vélo . type': $veloTypeValue,
					// 	'vélo . état': `'${$neufOuOccasion}'`,
					// })
					.evaluate(`aides . ${collectivite}`);

				if (!aide?.nodeValue) {
					return null;
				}
				const originalRuleName = aide.explanation.find(
					({ condition }) => condition.nodeValue === true,
				).consequence.name;

				if (!originalRuleName) {
					return null;
				}

				return { ruleName: originalRuleName, ...aide };
			})
			.filter(Boolean);

	$: sum = engine.evaluate('aides . montant');
</script>

<div class="mt-8" />

<a
	class="inline-block text-gray-500 text-md
    cursor-pointer
    hover:text-green-700 transform transition hover:-translate-x-1"
	data-sveltekit-nosroll
	href={$page.url.pathname}
>
	← Toutes les aides
</a>
<h2 class="font-bold mt-2 mb-5 text-gray-900 text-xl">
	{titleCategory($veloCat)}{#if emojiCategory($veloCat)}&nbsp;<Emoji
			emoji={emojiCategory($veloCat)}
		/>{/if}
</h2>

{#if categoryDescription}
	<p class="text-gray-700 text-sm">{categoryDescription}</p>
{/if}

<div class="flex border rounded mt-6 w-min border-gray-200">
	<button
		class="text-right rounded-l px-4 py-2 border-r {$neufOuOccasion === 'neuf'
			? 'bg-sky-100 text-sky-700 font-semibold'
			: 'hover:bg-sky-50 hover:text-sky-600 '}"
		on:click={() => ($neufOuOccasion = 'neuf')}
	>
		Neuf
	</button>
	<button
		class="rounded-r text-left px-4 py-2 basis-1/2 {$neufOuOccasion === 'occasion'
			? 'bg-amber-100 text-amber-700 font-semibold'
			: 'hover:bg-amber-50 hover:text-amber-600'}"
		on:click={() => ($neufOuOccasion = 'occasion')}
	>
		Occasion
	</button>
</div>

<div class="border rounded mt-3 bg-white">
	{#each aidesDetails as aide (aide.ruleName)}
		{@debug aide}
		<div transition:slide={{ duration: 200 }} class="border-b last:border-b-0">
			<DetailsLine veloEtat={$neufOuOccasion} {aide} />
		</div>
	{/each}
	<div class="py-4 px-3 sm:px-4 bg-gray-50 rounded-b-md">
		<div class="flex justify-between text-lg">
			<h3 class="font-semibold text-md">Total des aides</h3>
			<div class="font-bold">
				<AnimatedAmount veloEtat={$neufOuOccasion} amount={sum.nodeValue} unit={sum.unit} />
			</div>
		</div>
	</div>
</div>

<Questions />
