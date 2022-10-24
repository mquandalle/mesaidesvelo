<script>
	import Badge from '$lib/components/Badge.svelte';
	import RevenuSelector from './RevenuSelector.svelte';
	import miniaturesManifest from '$lib/data/miniatures.json';
	import { engine } from '$lib/engine';
	import { publicodeSituation } from '$lib/stores';
	import rules from '../../../../aides.yaml';
	import AnimatedAmount from '$lib/components/AnimatedAmount.svelte';

	const aides = Object.keys(rules).filter((aideName) => aideName.startsWith('aides . '));
	let activeAides = aides.filter((a) => engine.evaluate(a).nodeValue !== null);
	$: {
		engine.setSituation($publicodeSituation);
		activeAides = aides.filter((a) => engine.evaluate(a).nodeValue !== null);
	}
</script>

<RevenuSelector goals={activeAides} />
<div class="border-t border-b mt-6 bg-white">
	{#each activeAides as aide}
		{@const rawNode = engine.getRule(aide).rawNode}
		{@const conditionDeRessources = true}
		<!-- Hack -->
		{@const miniatureName = aide.includes('état') ? 'aides . prime à la conversion' : aide}
		<div class="flex flex-row border-b last:border-b-0">
			{#if miniaturesManifest[miniatureName]}
				<div
					class="basis-12 sm:basis-18 py-4 pl-3 pr-0 flex-shrink-0 opacity-85 cursor-pointer"
					on:click={() => rawNode.lien && window.open(rawNode.lien, '_blank')}
				>
					<img
						src="https://mesaidesvelo.fr/miniatures/{miniaturesManifest[miniatureName]}"
						class="object-fill"
						alt="Logo {rawNode.titre.toLowerCase()}"
					/>
				</div>
			{/if}
			<div class="my-4 mx-3 sm:mx-4 flex-grow">
				<div class="flex gap-x-4 text-lg flex-wrap">
					<h3 class="font-semibold text-md">
						{rawNode.titre}
					</h3>
					<div class="font-bold text-gray-800 flex-1 text-right sm:order-3">
						<AnimatedAmount
							amount={engine.evaluate(aide).nodeValue}
							unit={engine.evaluate(aide).unit}
						/>
					</div>
					{#if conditionDeRessources}
						<span class="w-full sm:w-auto">
							<Badge className="sm:order-2">Sous condition de ressources</Badge>
						</span>
					{/if}
				</div>
				{#if rawNode.description}
					<p class="text-gray-600 mt-2 text-sm ">
						{rawNode.description}
					</p>
				{/if}
				{#if rawNode.lien}
					<p class="mt-2 text-sm text-sky-700">
						<a href={rawNode.lien} target="_blank" class="hover:underline">→ En savoir plus</a>
					</p>
				{/if}
			</div>
		</div>
	{/each}
	{#if activeAides.length >= 2}
		<div class="flex flex-row bg-blue-gray-100 py-4 px-3">
			<h3 class="font-semibold text-md">Total</h3>
			<div class="font-bold text-gray-800 flex-1 text-right sm:order-3">
				<AnimatedAmount
					amount={activeAides.reduce((acc, aide) => acc + engine.evaluate(aide).nodeValue, 0)}
					unit={engine.evaluate('aides').unit}
				/>
			</div>
		</div>
	{/if}
</div>
