<script>
	import { localisation } from '$lib/stores';
</script>

{#if $localisation}
	<a
		class="inline-block text-gray-500 text-base
cursor-pointer
hover:text-green-700 transform transition hover:-translate-x-1"
		data-sveltekit-noscroll
		href="ville/{$localisation.slug}"
	>
		← Toutes les aides
	</a>
{/if}
