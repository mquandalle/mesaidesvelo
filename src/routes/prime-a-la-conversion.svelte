<script>
	import DetailsLine from '$lib/components/DetailsLine.svelte';

	import Questions from '$lib/components/Questions.svelte';

	import { localisation } from '$lib/stores';

	const ruleName = 'aides . prime à la conversion';
</script>

<div class="w-full max-w-screen-md m-auto">
	<div class="mt-8" />
	{#if $localisation}
		<a
			class="inline-block text-gray-500 text-md 
    cursor-pointer
    hover:text-green-700 transform transition hover:-translate-x-1"
			sveltekit:noscroll
			href="ville/{$localisation.slug}"
		>
			← Toutes les aides
		</a>
	{/if}

	<div class="border mt-6 rounded-md shadow-sm">
		<DetailsLine {ruleName} />
	</div>

	<Questions goals={[ruleName]} />
</div>
