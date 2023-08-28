<script>
	import miniaturesManifest from '$lib/data/miniatures.json';
	import { engine } from '$lib/engine';

	const aidesRuleNames = Object.keys(engine.getParsedRules()).filter(
		(ruleName) => ruleName.startsWith('aides .') && engine.getRule(ruleName).rawNode.titre
	);

	const determinants = "(du |de la |de l'|de l’|d'|d’|de la |des |de )";
	const simplifyTitle = (title) =>
		title
			.trim()
			.replace(new RegExp(`ville ${determinants}`, 'i'), '')
			.replace(new RegExp(`communauté des? communes ${determinants}?`, 'i'), '')
			.replace(
				new RegExp(`communauté( urbaine| d'agglomération | de communes)? ?${determinants}?`, 'i'),
				''
			)
			.replace(new RegExp(`agglomération\s*$`, 'i'), '')
			.replace(new RegExp(`département ${determinants}?`, 'i'), '')
			.trim();

	const googleSearchImageHref = (title) =>
		`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`logo ${title}`)}`;
	const startsWithLowerCase = (title) => {
		const firstChar = simplifyTitle(title)[0];
		return firstChar === firstChar.toLocaleLowerCase();
	};
</script>

<h1 class="mx-4 my-2 font-bold font-serif flex gap-x-3">
	<span
		class="no-underline bg-gray-800 text-light-100 rounded-full px-2 py-1 uppercase text-xs font-bold tracking-widest self-center"
		>DEV</span
	>
	Contrôle des miniatures
</h1>
<p class="mx-4 mb-4 text-xs text-gray-600">
	Cliquez sur une miniature pour ouvrir une recherche Google Images.
</p>

<div
	class="grid gap-2 items-stretch mx-4 mb-10"
	style="grid-template-columns: repeat(auto-fill,minmax(min(100%,120px),1fr));"
>
	{#each aidesRuleNames as aideRuleName}
		{@const title = engine.getRule(aideRuleName).rawNode.titre}
		<article class="flex flex-col justify-between items-center border shadow-sm p-2">
			<div>
				<a href={googleSearchImageHref(title)} {title}>
					{#if miniaturesManifest[aideRuleName]}
						<img
							src="/miniatures/{miniaturesManifest[aideRuleName]}"
							class="object-fill max-h-20"
							alt="Logo {title.toLowerCase()}"
						/>
					{:else}
						<span class="block bg-gray-200 text-gray-800 italic text-center">Pas de miniature</span>
					{/if}
				</a>
			</div>
			<h3
				class="text-xs text-center mt-4 {startsWithLowerCase(title)
					? 'first-letter:bg-yellow-300'
					: ''}"
			>
				{simplifyTitle(title)}
			</h3>
		</article>
	{/each}
</div>
