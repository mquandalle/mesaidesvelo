<script>
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';
	import DetailsLine from '$lib/components/DetailsLine.svelte';
	import Questions from '$lib/components/Questions.svelte';
	import { engine } from '$lib/engine';
	import { publicodeSituation, veloCat } from '$lib/stores';

	$: aides = ['aides . prime à la conversion', 'aides . prime à la conversion . surprime ZFE']
		.map((ruleName) => {
			const aide = engine
				.setSituation({
					...$publicodeSituation,
					'vélo . type': "'électrique'",
				})
				.evaluate(ruleName);
			if (!aide.nodeValue) {
				return null;
			}
			return { ruleName, ...aide };
		})
		.filter(Boolean);

	veloCat.set('électrique');
</script>

<div class="w-full max-w-screen-md m-auto">
	<div class="mt-8" />
	<BackButtonAides />

	<div class="border mt-6 rounded-md shadow-sm">
		{#if aides.length === 0}
			<p class="p-4 italic text-gray-600">
				Vous n'êtes pas éligible à la prime à la conversion selon votre situation.
			</p>
		{:else}
			{#each aides as aide, i}
				<DetailsLine className={i === 0 && aides.length > 1 ? 'border-b' : ''} {aide} />
			{/each}
		{/if}
	</div>

	<Questions goals={['aides . prime à la conversion']} />
</div>
