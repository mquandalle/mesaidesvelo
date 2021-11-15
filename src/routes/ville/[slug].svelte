<script context="module">
	export const ssr = false;
</script>

<script>
	import { page } from '$app/stores';
	import { localisation } from '$lib/stores/localisation';

	import { onMount } from 'svelte';

	onMount(async () => {
		if ($page.params.slug !== $localisation?.slug) {
			const res = await fetch(`/api/collectivites?slug=${$page.params.slug}`);
			if (res.ok) {
				localisation.set(await res.json());
			}
		}
	});
</script>
