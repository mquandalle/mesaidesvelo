<script>
	import { page } from '$app/stores';

	const pages = [
		['/a-propos', 'Questions fréquentes'],
		['/liste-aides', 'Liste des aides'],
		['/integrer-sur-mon-site', 'Intégrer sur mon site'],
		['/statistiques', 'Statistiques'],
		['/mentions-legales', 'Mentions légales'],
	];
</script>

<nav class="w-full max-w-screen-md m-auto pb-2 mt-6 shadow-inner">
	<ul class="flex flex-wrap gap-x-4 gap-y-3 text-gray-600">
		{#each pages as [path, label]}
			{@const isActive = $page.url.pathname.startsWith(path)}
			<li>
				<a
					href={path}
					aria-current={isActive ? true : undefined}
					class="hover:(bg-gray-100 rounded-t) p-2 {isActive
						? 'text-green-700 md:(border-b border-b-green-700 border-b-width-2)'
						: ''}">{label}</a
				>
			</li>
		{/each}
	</ul>
</nav>

<slot />

<style>
	nav {
		box-shadow: inset 0 -1px 0 #d1d5db;
	}
</style>
