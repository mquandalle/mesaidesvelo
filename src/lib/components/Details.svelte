<script>
	import { page } from '$app/stores';
	import AnimatedAmount from '$lib/components./../../lib/components/AnimatedAmount.svelte';
	import DetailsLine from '$lib/components./../../lib/components/DetailsLine.svelte';
	import Emoji from '$lib/components./../../lib/components/Emoji.svelte';
	import Questions from '$lib/components./../../lib/components/Questions.svelte';
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { publicodeSituation, resetAnswers, veloCat } from '$lib/stores';
	import { emojiCategory, titleCategory } from '$lib/utils';
	import { slide } from 'svelte/transition';

	resetAnswers();
	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': `'${$veloCat}'`,
	});

	const categoryDescription = baseEngine.getRule(`vélo . ${$veloCat}`).rawNode?.description ?? '';

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	$: aidesDetails =
		$publicodeSituation &&
		collectivites
			.map((collectivite) => {
				const aide = engine.evaluate(`aides . ${collectivite}`);
				if (!aide.nodeValue) {
					return null;
				}
				const originalRuleName = aide.explanation.find(({ condition }) => condition.isActive)
					.consequence.name;

				return originalRuleName;
			})
			.filter(Boolean);

	$: sum = engine.evaluate('aides . montant');

	// On simule deux branches : une pour un vélo neuf et une pour un vélo
	// d'occasion afin de déterminer s'il faut poser la question sur le vélo
	// neuf ou d'occasion.
	// TODO: trouver un moyen de ne pas refaire plusieurs fois les mêmes calculs.
	$: engineBis = engine = getEngine({
		...$publicodeSituation,
		'vélo . type': `'${$veloCat}'`,
	});
	$: montantAidesVeloOccasion = engineBis
		.setSituation({
			...$publicodeSituation,
			'vélo . type': `'${$veloCat}'`,
			'vélo . neuf ou occasion': '"occasion"',
		})
		.evaluate('aides . montant').nodeValue;
	$: montantAidesVeloNeuf = engineBis
		.setSituation({
			...$publicodeSituation,
			'vélo . type': `'${$veloCat}'`,
			'vélo . neuf ou occasion': '"neuf"',
		})
		.evaluate('aides . montant').nodeValue;
	$: demandeNeufOuOccasion =
		montantAidesVeloOccasion > 0 &&
		montantAidesVeloNeuf > 0 &&
		montantAidesVeloNeuf !== montantAidesVeloOccasion;
</script>

<div class="mt-8" />

<a
	class="inline-block text-gray-500 text-md
    cursor-pointer
    hover:text-s4-green transform transition hover:-translate-x-1"
	data-sveltekit-noscroll
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

<div class="border-t border-b mt-6 bg-white">
	{#each aidesDetails as ruleName (ruleName)}
		<div transition:slide={{ duration: 200 }} class="border-b last:border-b-0">
			<DetailsLine {ruleName} />
		</div>
	{/each}
	<div class="py-4 px-3 sm:px-4 bg-gray-50 rounded-b-md">
		<div class="flex justify-between text-lg">
			<h3 class="font-semibold text-md">Total des aides</h3>
			<div class="font-bold"><AnimatedAmount amount={sum.nodeValue} unit={sum.unit} /></div>
		</div>
		{#if false}
			<div class="flex justify-between text-lg mt-3 text-gray-600" transition:slide>
				<h3 class="font-semibold text-sm">Reste à charge</h3>
				<div class="font-semibold text-sm">XXX €</div>
			</div>
		{/if}
	</div>
</div>

<Questions {demandeNeufOuOccasion} />

{#if !demandeNeufOuOccasion && $veloCat !== 'motorisation'}
	<p class="mt-4">
		{#if aidesDetails.length === 1}Cette aide est valable{:else}Ces aides sont valables{/if}
		{#if montantAidesVeloNeuf === montantAidesVeloOccasion}
			pour un vélo neuf ou un vélo d’occasion.
		{:else if montantAidesVeloOccasion > 0}
			uniquement pour l’achat d’un vélo d’occasion.
		{:else}
			uniquement pour l’achat d’un vélo neuf.
		{/if}
	</p>
{/if}
