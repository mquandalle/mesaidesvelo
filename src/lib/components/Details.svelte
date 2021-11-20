<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import DetailsLine from './DetailsLine.svelte';
	import Emoji from './Emoji.svelte';
	import { emoji, engine, title } from './Results.svelte';
	import { localisationPublicodesSituation } from '$lib/stores/localisation';
	import RevenuSelector from './RevenuSelector.svelte';
	const formatValue = typeof window !== 'undefined' && window.publicodes.formatValue;

	const veloCat = $page.query.get('velo');
	const categoryDescription = engine?.getRule(`vélo . ${veloCat}`).rawNode?.description ?? '';

	let bikePrice;
	let revenu = 0;

	$: getEngine = () => {
		if (!$localisationPublicodesSituation) {
			return engine;
		}
		engine.setSituation({
			...$localisationPublicodesSituation,
			'vélo . type': `'${veloCat}'`,
			'revenu fiscal de référence': `${revenu} €/an`,
			...(bikePrice ? { 'vélo . prix': `${bikePrice} €` } : {})
		});
		return engine;
	};

	const defaultDescription = '';

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	$: aidesDetails = collectivites
		.map((collectivite) => {
			const aide = getEngine().evaluate(`aides . ${collectivite}`);
			if (!aide.nodeValue) {
				return null;
			}
			const originalRuleName = aide.explanation.find(({ satisfied }) => satisfied).consequence.name;
			const { title, rawNode } = engine.getRule(originalRuleName);
			const description = rawNode.description ?? defaultDescription;
			const plafondRuleName = `${originalRuleName} . $plafond`;
			const plafondIsDefined = Object.keys(engine.parsedRules).includes(plafondRuleName);
			const plafond = plafondIsDefined && engine.evaluate(plafondRuleName);
			const notice = description
				.replace(/\$vélo/g, `vélo ${veloCat}`)
				.replace(/\$plafond/, formatValue(plafond?.nodeValue, { displayedUnit: '€' }));

			const evaluateWithGivenRevenu = (revenu) =>
				engine
					.shallowCopy()
					.setSituation({
						...engine.parsedSituation,
						'revenu fiscal de référence': `${revenu} €/an`,
						'vélo . prix': 'vélo . prix pour maximiser les aides'
					})
					.evaluate(originalRuleName).nodeValue;
			const conditionDeRessources =
				evaluateWithGivenRevenu(revenu) !== evaluateWithGivenRevenu(100000);

			return {
				title,
				ruleName: originalRuleName,
				link: rawNode.lien,
				notice,
				montant: formatValue(aide, { precision: 0 }),
				conditionDeRessources
			};
		})
		.filter(Boolean);

	$: sum = formatValue(getEngine().evaluate('aides'), { precision: 0 });
</script>

<div class="mt-8" />

<span
	class="inline-block text-gray-500 text-md 
    cursor-pointer
    hover:text-green-700 transform transition hover:-translate-x-1"
	on:click={() => goto($page.path, { noscroll: true })}
>
	← Toutes les aides
</span>
<h2 class="font-bold mt-2 mb-5 text-gray-900 text-xl">
	{title(veloCat)}{#if emoji(veloCat)}&nbsp;<Emoji emoji={emoji(veloCat)} />{/if}
</h2>

{#if categoryDescription}
	<p class="text-gray-700 text-sm">{categoryDescription}</p>
{/if}

<div class="border mt-6 rounded-md shadow-sm">
	{#each aidesDetails as aide (aide.ruleName)}
		<div transition:slide|local={{ duration: 200 }} class="border-b last:border-b-0 p-4">
			<DetailsLine {aide} />
		</div>
	{/each}
	<div class="p-4 bg-gray-50 rounded-b-md">
		<div class="flex justify-between text-lg">
			<h3 class="font-semibold text-md">Total des aides</h3>
			<div class="font-bold">{sum}</div>
		</div>
		{#if false}
			<div class="flex justify-between text-lg mt-3 text-gray-600" transition:slide|local>
				<h3 class="font-semibold text-sm">Reste à charge</h3>
				<div class="font-semibold text-sm">XXX €</div>
			</div>
		{/if}
	</div>
</div>

<div class="border-l-4 mt-8 border-green-200 pl-4 py-3 bg-gray-50">
	<div
		class="inline-block relative -left-8.5 bg-white border-4 border-green-200 w-8 h-8 rounded-full font-bold text-green-300 text-center leading-6"
	>
		€
	</div>
	<p class="text-gray-600 text-md -mt-7 pl-3 italic">Affinez le calcul :</p>
	<RevenuSelector rules={aidesDetails.map((r) => r.ruleName)} bind:value={revenu} />
	<div class="inline-flex flex-col mt-6 items-start shadow-sm ">
		<label for="velo-prix"
			>Prix du {#if veloCat === 'motorisation'}kit de convesion{:else}vélo{/if} :</label
		>
		<div class="border rounded p-2 mt-1 bg-white">
			<input
				type="number"
				id="velo-prix"
				class="m-0 text-right w-35 focus:outline-transparent"
				bind:value={bikePrice}
			/>
			<span class="text-gray-600">€</span>
		</div>
	</div>
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
