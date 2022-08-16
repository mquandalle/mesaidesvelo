<script>
	import Emoji from '$lib/components/Emoji.svelte';
	import { engine } from '$lib/engine';
	import { answers, localisation, publicodeSituation } from '$lib/stores';
	import { emojiCategory, titleCategory } from '$lib/utils';
	import { formatValue } from 'publicodes';
	import { getContext } from 'svelte';
	import CategoryLine from './CategoryLine.svelte';
	import SeoText from './SEOText.svelte';

	const bikeKinds = engine?.getRule('vélo . type').rawNode['possibilités'];
	const embeded = getContext('embeded');

	answers.set({});

	$: aidesPerBikeKind = bikeKinds
		.map((kind) => {
			if (!$localisation) return [];
			engine.setSituation({
				...$publicodeSituation,
				'maximiser les aides': 'oui',
				'vélo . type': `'${kind}'`
			});
			return [kind, engine.evaluate('aides . montant')];
		})
		.map(([cat, node]) => [
			cat,
			{
				label: titleCategory(cat),
				emoji: emojiCategory(cat),
				montant: node?.nodeValue ? formatValue(node, { precision: 0 }) : 0
			}
		]);

	$: primeALaConversion = engine
		.setSituation({
			...$publicodeSituation,
			'vélo . type': "''"
		})
		.evaluate('aides . prime à la conversion');

	// TODO: use `groupBy` partition when available
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
	$: activesAidesPerBikeKind = aidesPerBikeKind.filter(([, { montant }]) => montant !== 0);
	$: inactivesAidesPerBikeKind = aidesPerBikeKind.filter(([, { montant }]) => montant === 0);

	$: inFrance = !!engine
		.setSituation($publicodeSituation)
		.evaluate("localisation . pays = 'France'").nodeValue;

	$: onlyNationalAides =
		inFrance &&
		bikeKinds.every(
			(kind) =>
				!(
					engine
						.setSituation({
							...$publicodeSituation,
							'localisation . pays': "'nawak'",
							'maximiser les aides': 'oui',
							'vélo . type': `'${kind}'`
						})
						.evaluate('aides . montant').nodeValue > 0
				)
		);
</script>

<div class="mt-8" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<table class="flex flex-col border rounded shadow-md bg-white sm:text-lg">
	{#each activesAidesPerBikeKind as [cat, { montant, label, emoji }]}
		<CategoryLine {montant} href="?velo={cat}"
			>{label}{#if emoji}&nbsp;<Emoji {emoji} />{/if}</CategoryLine
		>
	{/each}
	{#if primeALaConversion.nodeValue}
		<CategoryLine
			montant={formatValue(primeALaConversion, { precision: 0 })}
			href="/prime-a-la-conversion"
			>Prime à la conversion <Emoji emoji="🚗" /> →<Emoji emoji="🚲" /></CategoryLine
		>
	{/if}
	{#if inFrance}
		<CategoryLine montant={'500 €/an'} href="/forfait-mobilite-durable"
			>Forfait mobilités durables
		</CategoryLine>
		{#each inactivesAidesPerBikeKind as [cat, { montant, label }]}
			<CategoryLine {montant} href="?velo={cat}">{label}</CategoryLine>
		{/each}
	{/if}
</table>

{#if !embeded && $localisation?.nom === 'Bordeaux'}
	<SeoText />
{/if}

{#if onlyNationalAides && $localisation?.nom}
	<p class="mt-8 mx-2 text-gray-700">
		<strong>Note :</strong><br />Les aides affichées sont les aides nationales. Ni la ville de
		{$localisation.nom}, ni le département, ni la région ne proposent d’aides locales.
	</p>
{/if}
