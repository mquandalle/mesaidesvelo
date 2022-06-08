<script>
	import { engine, getCurrentBikeEngine } from '$lib/engine';
	import { formatDescription } from '$lib/utils';

	import AnimatedAmount from './AnimatedAmount.svelte';
	import Badge from './Badge.svelte';

	export let ruleName;
	export let veloCat = '';

	$: aide = $getCurrentBikeEngine().evaluate(ruleName);

	const { title, rawNode } = engine.getRule(ruleName);
	const notice = formatDescription({ ruleName, engine, veloCat });

	const evaluateWithGivenRevenu = (revenu) =>
		engine
			.setSituation({
				...engine.parsedSituation,
				...(revenu ? { 'revenu fiscal de référence': `${revenu} €/an` } : {}),
				'vélo . prix': 'vélo . prix pour maximiser les aides'
			})
			.evaluate(ruleName).nodeValue;
	const conditionDeRessources = evaluateWithGivenRevenu() !== evaluateWithGivenRevenu(100000);
</script>

<div class="my-4 mx-3 sm:mx-4">
	<div class="flex gap-x-4 text-lg flex-wrap">
		<h3 class="font-semibold text-md">
			{title}
		</h3>
		<div class="font-bold text-gray-800 flex-1 text-right sm:order-3">
			<AnimatedAmount amount={aide.nodeValue} unit={aide.unit} />
		</div>
		{#if conditionDeRessources}
			<span class="w-full sm:w-auto">
				<Badge className="sm:order-2">Sous condition de ressources</Badge>
			</span>
		{/if}
	</div>
	<p class="text-gray-600 mt-2 text-sm ">
		{notice}
	</p>
	{#if rawNode.lien}
		<p class="mt-2 text-sm text-green-700">
			<a href={rawNode.lien} target="_blank" class="hover:underline">→ En savoir plus</a>
		</p>
	{/if}
</div>
