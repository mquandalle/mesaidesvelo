<script context="module">
	import aides from '$lib/../aides.yaml';
	export const engine = typeof window !== 'undefined' ? new window.publicodes.default(aides) : null;
</script>

<script>
	import CategoryLine from '$lib/components/CategoryLine.svelte';
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
		.map(([cat, node]) => [cat, window.publicodes.formatValue(node, { precision: 0 })]);
</script>

<div class="mt-8" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<div class="border rounded shadow-md sm:text-lg">
	{#each aidesPerBikeKind as [cat, montant]}
		<CategoryLine
			label="Achat d’un vélo {cat}"
			{montant}
			on:click={() => goto(`?velo=${cat}`, { noscroll: true })}
		/>
	{/each}
</div>
