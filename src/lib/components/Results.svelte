<script context="module">
	import aides from '$lib/../aides.yaml';

	// HACK : Le paquet publicodes ne peut pas être importé normallement avec un
	// `import Engine from "publicodes"`, vraisembablement car le paquet n'est pas sous
	// le bon format ES Module
	export const engine = typeof window !== 'undefined' ? new window.publicodes.default(aides) : null;

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
	import { localisation, localisationPublicodesSituation } from '$lib/stores/localisation';
	import { goto } from '$app/navigation';

	const bikeKinds = engine?.getRule('vélo . type').rawNode['possibilités'];

	$: aidesPerBikeKind = bikeKinds
		.map((type) => {
			if (!$localisation) return [];
			engine.setSituation({
				...$localisationPublicodesSituation,
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
				montant: window.publicodes.formatValue(node, { precision: 0 })
			}
		]);
</script>

<div class="mt-8" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<div class="border rounded shadow-md sm:text-lg">
	{#each aidesPerBikeKind as [cat, { montant, label, emoji }]}
		<CategoryLine {montant} on:click={() => goto(`?velo=${cat}`, { noscroll: true })}
			>{label}{#if emoji}
				&nbsp;<Emoji {emoji} />{/if}</CategoryLine
		>
	{/each}
</div>
