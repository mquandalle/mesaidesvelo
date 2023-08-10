<script>
	import miniaturesManifest from '$lib/data/miniatures.json';
	import { engine } from '$lib/engine';

	const aidesRuleNames = Object.keys(engine.getParsedRules()).filter(
		(ruleName) => ruleName.startsWith('aides .') && engine.getRule(ruleName).rawNode.titre
	);

	function simplifyTitle(title) {
		return title
			.trim()
			.replace(/ville (d'|d’|de)/i, '')
			.replace(/communauté des? communes ?(du|de la|des|de)?/i, '')
			.replace(/communauté( urbaine| d'agglomération( de)?)?/i, '')
			.replace(/département (du|de la|de l'|de)/i, '')
			.trim();
	}
</script>

<h1 class="mx-4 my-2 font-bold font-serif">
	<span
		class="mr-4 no-underline bg-gray-800 text-light-100 rounded-full px-2 py-1 uppercase text-xs font-bold tracking-widest self-center"
		>DEV</span
	>
	Contrôle des miniatures
</h1>

<div
	class="grid gap-2 items-stretch mx-4 mb-10"
	style="grid-template-columns: repeat(auto-fill,minmax(min(100%,120px),1fr));"
>
	{#each aidesRuleNames as aideRuleName}
		{@const title = engine.getRule(aideRuleName).rawNode.titre}
		<article class="flex flex-col justify-between items-center border shadow-sm p-2">
			<div>
				{#if miniaturesManifest[aideRuleName]}
					<img
						src="/miniatures/{miniaturesManifest[aideRuleName]}"
						class="object-fill max-h-20"
						alt="Logo {title.toLowerCase()}"
					/>
				{:else}
					<div class="bg-gray-200 text-gray-800 italic text-center">Pas de miniature</div>
				{/if}
			</div>
			<h3 class="text-xs text-center mt-4">{simplifyTitle(title)}</h3>
		</article>
	{/each}
</div>
