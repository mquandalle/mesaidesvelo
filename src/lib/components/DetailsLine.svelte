<script>
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { formatDescription } from '$lib/utils';
	import miniaturesManifest from '$lib/data/miniatures.json';

	import AnimatedAmount from './AnimatedAmount.svelte';
	import Badge from './Badge.svelte';
	import { localisation, publicodeSituation, veloCat } from '$lib/stores';

	export let ruleName;

	$: engine = getEngine({ ...$publicodeSituation, 'vélo . type': `'${$veloCat}'` });
	$: aide = engine.evaluate(ruleName);

	const { title, rawNode } = baseEngine.getRule(ruleName);
	$: notice = formatDescription({
		ruleName,
		engine,
		veloCat: $veloCat,
		ville: $localisation,
	});

	$: evaluateWithGivenRevenu = (revenu) =>
		engine
			.setSituation({
				...$publicodeSituation,
				'vélo . type': `'${$veloCat}'`,
				'revenu fiscal de référence': `${revenu} €/an`,
				'vélo . prix': 'vélo . prix pour maximiser les aides',
			})
			.evaluate(ruleName).nodeValue;

	// TODO: we could optimize this calcul which is done 2 times : one time in
	// revenuSelector and one time here
	$: conditionDeRessources = evaluateWithGivenRevenu(100) !== evaluateWithGivenRevenu(100000);
</script>

{#if aide.nodeValue !== null}
	<div class="flex flex-row">
		{#if miniaturesManifest[ruleName]}
			<div
				class="basis-12 sm:basis-18 py-4 pl-3 pr-0 flex-shrink-0 opacity-85 cursor-pointer"
				on:click={() => rawNode.lien && window.open(rawNode.lien, '_blank')}
			>
				<img
					src="/miniatures/{miniaturesManifest[ruleName]}"
					class="object-fill"
					alt="Logo {title.toLowerCase()}"
				/>
			</div>
		{/if}
		<div class="my-4 mx-3 sm:mx-4 flex-grow">
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
			<p class="text-gray-600 mt-2 text-sm">
				{notice}
			</p>
			{#if rawNode.lien}
				<p class="mt-2 text-sm text-s4-green">
					<a href={rawNode.lien} target="_blank" class="hover:underline">→ En savoir plus</a>
				</p>
			{/if}
		</div>
	</div>
{/if}
