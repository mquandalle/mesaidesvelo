<script>
	const articles = [
		{
			titre: 'Le site qui recense toutes les subventions par commune !',
			site: 'Les Echos Start',
			url: 'https://start.lesechos.fr/au-quotidien/budget-conso/mes-aides-velo-le-site-qui-recense-toutes-les-subventions-par-commune-1378553'
		},
		{
			titre: 'Le site qui mouline pour vous les aides à l’achat d’un vélo',
			site: 'Enlarge Your Paris',
			url: 'https://www.enlargeyourparis.fr/societe/mesaidesvelo-le-site-qui-mouline-pour-vous-les-aides-a-lachat-dun-velo'
		}
	];
</script>

<svelte:head>
	<title>Statistiques - MesAidesVélo</title>
</svelte:head>

<div>
	<script async src="https://plausible.io/js/embed.host.js"></script>
	<iframe
		plausible-embed
		title="Statistiques plausible"
		src="https://plausible.io/share/mesaidesvelo.fr?auth=LfNTf6VXOA2eUNAku7tfL&embed=true&theme=light&background=transparent"
		scrolling="no"
		frameborder="0"
		loading="lazy"
		style="width: 1px; min-width: 100%; height: 1600px;"
	/>
</div>

<div class="prose w-full max-w-screen-md m-auto">
	<h2>Ils en parlent</h2>
	<ul>
		{#each articles as article}
			<li>
				<a
					target="_blank"
					href={article.url}
					class="hover:text-green-600 !font-normal !no-underline"
					><span class="font-semibold">« {article.titre} »</span><br /><span
						class="text-sm text-gray-700"
						>sur <strong class="!text-gray-700">{article.site}</strong></span
					></a
				>
			</li>
		{/each}
	</ul>
</div>
