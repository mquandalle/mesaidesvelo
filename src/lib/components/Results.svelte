<script context="module">
	export function title(category) {
		if (category === 'motorisation') {
			return 'Motorisation d’un vélo classique';
		}
		return `Achat d’un vélo ${category}`;
	}

	export function emoji(category) {
		if (category === 'motorisation' || title(category).includes('électrique')) {
			return '⚡';
		}
	}
</script>

<script>
	import CategoryLine from '$lib/components/CategoryLine.svelte';
	import Emoji from '$lib/components/Emoji.svelte';
	import { answers, localisation, publicodeSituation } from '$lib/stores';
	import { engine } from '$lib/engine';
	import { formatValue } from 'publicodes';

	const bikeKinds = engine?.getRule('vélo . type').rawNode['possibilités'];

	answers.set({});

	$: aidesPerBikeKind = bikeKinds
		.map((type) => {
			if (!$localisation) return [];
			engine.setSituation({
				...$publicodeSituation,
				'maximiser les aides': 'oui',
				'vélo . type': `'${type}'`
			});
			return [type, engine.evaluate('aides')];
		})
		.filter(([, node]) => node?.nodeValue)
		.map(([cat, node]) => [
			cat,
			{
				label: title(cat),
				emoji: emoji(cat),
				montant: formatValue(node, { precision: 0 })
			}
		]);

	$: primeALaConversion = engine
		.setSituation({
			...$publicodeSituation,
			'vélo . type': "''"
		})
		.evaluate('aides . prime à la conversion');
</script>

<div class="mt-8" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<div class="border rounded shadow-md bg-white sm:text-lg">
	{#each aidesPerBikeKind as [cat, { montant, label, emoji }]}
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
</div>
