<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import DetailsLine from './DetailsLine.svelte';
	import Emoji from './Emoji.svelte';
	import { emoji, title } from './Results.svelte';
	import { formatValue } from 'publicodes';
	import { engine, getCurrentBikeEngine } from '$lib/engine';
	import Questions from './Questions.svelte';
	import AnimatedAmount from './AnimatedAmount.svelte';

	const veloCat = $page.query.get('velo');
	const categoryDescription = engine.getRule(`vélo . ${veloCat}`).rawNode?.description ?? '';

	const defaultDescription = '';

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	$: aidesDetails = collectivites
		.map((collectivite) => {
			const aide = $getCurrentBikeEngine().evaluate(`aides . ${collectivite}`);
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
				.replace(/\$vélo/g, veloCat === 'motorisation' ? 'kit de motorisation' : `vélo ${veloCat}`)
				.replace(/\$plafond/, formatValue(plafond?.nodeValue, { displayedUnit: '€' }));

			const evaluateWithGivenRevenu = (revenu) =>
				engine
					.setSituation({
						...engine.parsedSituation,
						...(revenu ? { 'revenu fiscal de référence': `${revenu} €/an` } : {}),
						'vélo . prix': 'vélo . prix pour maximiser les aides'
					})
					.evaluate(originalRuleName).nodeValue;
			const conditionDeRessources = evaluateWithGivenRevenu() !== evaluateWithGivenRevenu(100000);

			return {
				title,
				ruleName: originalRuleName,
				link: rawNode.lien,
				notice,
				amount: aide.nodeValue,
				unit: aide.unit,
				conditionDeRessources
			};
		})
		.filter(Boolean);

	$: sum = $getCurrentBikeEngine().evaluate('aides');
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

<Questions goals={aidesDetails.map((r) => r.ruleName)} />
