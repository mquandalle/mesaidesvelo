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

<nav class="w-full max-w-screen-md m-auto pb-2 mt-6 border-b">
	<ul class="flex flex-wrap gap-x-4 gap-y-3 text-gray-600">
		{#each pages as [path, label]}
			{@const isActive = page.url.pathname.startsWith(path)}
			<li>
				<a
					href={path}
					aria-current={isActive ? true : undefined}
					class="hover:bg-green-50 hover:text-green-600 hover:rounded p-2 {isActive
						? 'text-green-600'
						: ''}">{label}</a
				>
			</li>
		{/each}
	</ul>
</nav>

{@render children?.()}

<style>
</style>
