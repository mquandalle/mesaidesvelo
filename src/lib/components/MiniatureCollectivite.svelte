<script lang="ts">
	import miniatures from '$lib/data/miniatures.json';

	interface Props {
		ruleName: string;
		titre: string;
	}

	const miniatureByRule = miniatures as Record<string, string>;
	let { ruleName, titre }: Props = $props();
	let miniature = $derived(miniatureByRule[ruleName]);
</script>

{#if miniature}
	<img
		src="/miniatures/{miniature}"
		alt="Logo de {titre}"
		class="float-left pt-4 mr-6 !mb-6 max-h-[120px] w-[140px] object-contain"
	/>
{/if}
