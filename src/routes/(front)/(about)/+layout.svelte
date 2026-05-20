<script lang="ts">
	import { page } from '$app/state';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const pages = [
		['/a-propos', 'Questions fréquentes'],
		['/liste-aides', 'Liste des aides'],
		['/integrer-sur-mon-site', 'Intégrer sur mon site'],
		['/statistiques', 'Statistiques'],
		['/mentions-legales', 'Mentions légales'],
	];
</script>

<nav
	class="mx-auto mt-6 w-full max-w-screen-md border-b border-[#dfe6ef] pb-3"
	aria-label="Pages d'information"
>
	<ul class="flex flex-wrap gap-2 text-sm text-[#647085]">
		{#each pages as [path, label]}
			{@const isActive = page.url.pathname.startsWith(path)}
			<li>
				<a
					href={path}
					aria-current={isActive ? true : undefined}
					class="inline-flex rounded-full px-3 py-2 font-semibold no-underline hover:bg-[#dcfce7] hover:text-[#16a34a] {isActive
						? 'bg-[#dcfce7] text-[#16a34a]'
						: ''}">{label}</a
				>
			</li>
		{/each}
	</ul>
</nav>

{@render children?.()}

<style>
</style>
