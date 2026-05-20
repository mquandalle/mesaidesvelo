<script>
	import { getSimulation } from '$lib/simulation/context.svelte';

	const simulation = getSimulation();
</script>

{#if simulation.selectedLocalisation}
	<a
		class="inline-flex text-sm font-semibold text-[#647085]
cursor-pointer
hover:text-[#16a34a] transform transition hover:-translate-x-1"
		data-sveltekit-noscroll
		href="ville/{simulation.selectedLocalisation.slug}"
	>
		← Toutes les aides
	</a>
{/if}
