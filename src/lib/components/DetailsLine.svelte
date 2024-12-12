<script>
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { formatDescription } from '$lib/utils';
	import miniatures from '$lib/data/miniatures';

	import AnimatedAmount from './AnimatedAmount.svelte';
	import Badge from './Badge.svelte';
	import { localisation, publicodeSituation, veloCat, veloTypeValue } from '$lib/stores';
	import SvelteMarkdown from 'svelte-markdown';

	export let ruleName;

	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': $veloTypeValue,
	});
	$: aide = engine.evaluate(ruleName);

	const { title, rawNode } = baseEngine.getRule(ruleName);
	$: notice = formatDescription({
		ruleName,
		engine,
		veloCat: $veloCat,
		ville: $localisation,
	});

	$: evaluateWithGivenRevenu = (revenu) => {
		return engine
			.setSituation({
				...$publicodeSituation,
				'vélo . type': $veloTypeValue,
				'revenu fiscal de référence par part': `${revenu} €/an`,
				'vélo . prix': 'vélo . prix pour maximiser les aides',
			})
			.evaluate(ruleName).nodeValue;
	};

	// TODO: we could optimize this calcul which is done 2 times : one time in
	// revenuSelector and one time here
	$: conditionDeRessources = evaluateWithGivenRevenu(100) !== evaluateWithGivenRevenu(100000);
</script>

{#if aide.nodeValue !== null}
	<div class="flex flex-row items-start">
		{#if miniatures[ruleName]}
			<button
				title="Logo {title.toLowerCase()} (ouvrir le site dans un nouvel onglet)"
				class="basis-12 sm:basis-18 py-4 pl-3 pr-0 flex-shrink-0 opacity-85 cursor-pointer"
				on:click={() => rawNode.lien && window.open(rawNode.lien, '_blank')}
			>
				<img
					src="/miniatures/{miniatures[ruleName]}"
					class="object-fill"
					alt="Logo {title.toLowerCase()}"
				/>
			</button>
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
			<div class="text-gray-600 mt-2 prose-sm">
				<SvelteMarkdown source={notice} options={{ breaks: true }} />
			</div>
			{#if rawNode.lien}
				<p class="mt-2 text-sm text-green-700">
					<a href={rawNode.lien} target="_blank" class="hover:underline">→ En savoir plus</a>
				</p>
			{/if}
		</div>
	</div>
{/if}
