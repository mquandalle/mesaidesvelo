<script>
	const articles = [
		{
			titre: 'Ce site vous déniche des subventions pour acheter un vélo',
			media: 'Picala',
			url: 'https://www.picala.fr/pratique/mesaidesvelo-ce-site-vous-deniche-des-subventions-pour-acheter-un-velo',
		},
		{
			titre: 'Trouvez les aides à l’achat d’un vélo',
			media: 'BFM Paris Île-de-France',
			url: 'https://twitter.com/BFMParis/status/1508321459747368963',
		},
		{
			titre: 'Le site qui recense toutes les subventions par commune !',
			media: 'Les Echos Start',
			url: 'https://start.lesechos.fr/au-quotidien/budget-conso/mes-aides-velo-le-site-qui-recense-toutes-les-subventions-par-commune-1378553',
		},
		{
			titre: 'Le site qui mouline pour vous les aides à l’achat d’un vélo',
			media: 'Enlarge Your Paris',
			url: 'https://www.enlargeyourparis.fr/societe/mesaidesvelo-le-site-qui-mouline-pour-vous-les-aides-a-lachat-dun-velo',
		},
	];
</script>

<svelte:head>
	<title>Statistiques - MesAidesVélo</title>
</svelte:head>

<div class="mx-auto mt-8 w-full max-w-screen-lg">
	<iframe
		plausible-embed
		src="https://plausible.quandalle.com/share/mesaidesvelo.fr?auth=718e74b5c4076bd9b8f95e64fa847c9a&embed=true&theme=light&background=transparent&width=manual"
		title="Statistiques Plausible de MesAidesVélo"
		scrolling="no"
		frameborder="0"
		loading="lazy"
		style="width: 1px; min-width: 100%; height: 1600px; color-scheme: auto;"
	></iframe>
	<div style="font-size: 14px; padding-bottom: 14px;">
		Stats powered by <a
			target="_blank"
			style="color: #4F46E5; text-decoration: underline;"
			href="https://plausible.io">Plausible Analytics</a
		>
	</div>
	<script async src="https://plausible.quandalle.com/js/embed.host.js"></script>
</div>

<div class="prose mx-auto mt-8 w-full max-w-screen-md">
	<h2>Ils en parlent</h2>
	<ul>
		{#each articles as article (article.url)}
			<li>
				<a
					target="_blank"
					href={article.url}
					class="hover:text-green-600 !font-normal !no-underline"
					><span class="font-semibold">« {article.titre} »</span><br /><span
						class="text-sm text-gray-700"
						>sur <strong class="!text-gray-700">{article.media}</strong></span
					></a
				>
			</li>
		{/each}
	</ul>
</div>
