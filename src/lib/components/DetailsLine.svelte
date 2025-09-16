<script>
	import { allAides } from '$lib/aides-velo-utils';
	import miniatures from '$lib/data/miniatures';
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { localisation, publicodeSituation, veloCat, veloTypeValue } from '$lib/stores';
	import { formatDescription, slugify } from '$lib/utils';
	import SvelteMarkdown from 'svelte-markdown';
	import AnimatedAmount from './AnimatedAmount.svelte';
	import Badge from './Badge.svelte';

	export let className = '';
	export let aide;
	export let veloEtat = 'neuf';

	$: engine = getEngine({
		...$publicodeSituation,
		'vélo . type': $veloTypeValue,
		'vélo . état': `'${veloEtat}'`,
	});

	const { title, rawNode } = baseEngine.getRule(aide.ruleName);
	const { lastUpdate, endDate } = allAides.find((a) => a.id === aide.ruleName) || {
		lastUpdate: null,
		endDate: null,
	};
	const isExpired = new Date().getTime() >= endDate?.getTime();

	$: notice = formatDescription({
		ruleName: aide.ruleName,
		engine,
		veloCat: $veloCat,
		ville: $localisation,
	});

	$: evaluateWithGivenRevenu = (revenu) => {
		return engine
			.setSituation({
				...$publicodeSituation,
				'vélo . type': $veloTypeValue,
				'vélo . état': `'${veloEtat}'`,
				'revenu fiscal de référence par part': `${revenu} €/an`,
				'vélo . prix': 'vélo . prix pour maximiser les aides',
			})
			.evaluate(aide.ruleName).nodeValue;
	};

	// TODO: we could optimize this calcul which is done 2 times : one time in
	// revenuSelector and one time here
	$: conditionDeRessources = evaluateWithGivenRevenu(100) !== evaluateWithGivenRevenu(100000);
</script>

{#if aide.nodeValue !== null}
	<div class={'flex flex-row items-start ' + (isExpired ? 'bg-gray-50 ' : '') + ' ' + className}>
		{#if miniatures[aide.ruleName]}
			<button
				title="Logo {title.toLowerCase()} (ouvrir le site dans un nouvel onglet)"
				class="basis-12 sm:basis-18 py-4 pl-3 pr-0 flex-shrink-0 opacity-85 cursor-pointer"
				on:click={() => rawNode.lien && window.open(rawNode.lien, '_blank')}
			>
				<img
					src="/miniatures/{miniatures[aide.ruleName]}"
					class="object-fill"
					alt="Logo {title.toLowerCase()}"
				/>
			</button>
		{/if}
		<div class="my-4 mx-3 sm:mx-4 flex-grow">
			<div class="flex">
				<div class="flex gap-x-4 text-lg flex-wrap">
					<h3 class="font-semibold text-md mb-1">
						{title}
					</h3>
					<div class="flex flex-wrap gap-2 items-center sm:items-start">
						{#if endDate}
							<Badge
								className={'mb-1 sm:mb-0 ' +
									(isExpired ? 'bg-red-50 border-red-100 text-red-800' : '')}
							>
								Jusqu'au {endDate.toLocaleDateString('fr-FR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</Badge>
						{/if}
						{#if conditionDeRessources}
							<Badge className="">Sous condition de ressources</Badge>
						{/if}
					</div>
				</div>
				<div
					class="
            ml-4
            font-bold text-lg text-gray-800 flex-1 text-right sm:order-3 playwright-{slugify(
						aide.ruleName,
					)}
          "
					data-testid={slugify(aide.ruleName)}
				>
					<AnimatedAmount amount={aide.nodeValue} unit={aide.unit} />
				</div>
			</div>
			<div class="text-gray-600 mt-4 prose-sm">
				<SvelteMarkdown source={notice} options={{ breaks: true }} />
			</div>
			<div class="inline-flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
				{#if rawNode.lien}
					<p class="mt-4 text-sm text-green-600">
						<a href={rawNode.lien} target="_blank" class="hover:underline">→ En savoir plus</a>
					</p>
				{/if}
				{#if lastUpdate}
					<p class="mt-4 text-[0.66rem] text-gray-500 italic">
						Mis à jour le {lastUpdate.toLocaleDateString('fr-FR', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
