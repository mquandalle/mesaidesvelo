<script lang="ts">
	import { allAides } from '$lib/aides-velo-utils';
	import miniatures from '$lib/data/miniatures.json';
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { getSimulationForm } from '$lib/simulation/context.svelte';
	import { formatDescription, slugify } from '$lib/utils';
	import SvelteMarkdown from '@modal-labs/svelte-markdown';
	import AnimatedAmount from './AnimatedAmount.svelte';
	import Badge from './Badge.svelte';

	interface Props {
		className?: string;
		aide: any;
		veloEtat?: string;
	}

	let { className = '', aide, veloEtat = 'neuf' }: Props = $props();
	const form = getSimulationForm();

	let ruleDefinition = $derived(baseEngine.getRule(aide.ruleName));
	let title = $derived(ruleDefinition.title);
	let rawNode = $derived(ruleDefinition.rawNode);
	let lien = $derived(typeof rawNode.lien === 'string' ? rawNode.lien : undefined);
	let aideMetadata = $derived(allAides.find((a) => a.id === aide.ruleName));
	let lastUpdate = $derived(aideMetadata?.lastUpdate ?? null);
	let endDate = $derived(aideMetadata?.endDate ?? null);
	let engine = $derived(
		getEngine({
			...form.publicodeSituation,
			...(form.veloTypeValue ? { 'vélo . type': form.veloTypeValue } : {}),
			'vélo . état': `'${veloEtat}'`,
		}),
	);

	let isExpired = $derived(endDate ? new Date().getTime() >= endDate.getTime() : false);

	let notice = $derived(
		formatDescription({
			ruleName: aide.ruleName,
			engine,
			veloCat: form.veloCat,
			ville: form.localisation,
		}),
	);

	function evaluateWithGivenRevenu(revenu: number) {
		return engine
			.setSituation({
				...form.publicodeSituation,
				...(form.veloTypeValue ? { 'vélo . type': form.veloTypeValue } : {}),
				'vélo . état': `'${veloEtat}'`,
				'revenu fiscal de référence par part': `${revenu} €/an`,
				'vélo . prix': 'vélo . prix pour maximiser les aides',
			})
			.evaluate(aide.ruleName).nodeValue;
	}

	// TODO: we could optimize this calcul which is done 2 times : one time in
	// revenuSelector and one time here
	let conditionDeRessources = $derived(
		evaluateWithGivenRevenu(100) !== evaluateWithGivenRevenu(100000),
	);
</script>

{#if aide.nodeValue !== null}
	<div
		class={'flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:p-5 ' +
			(isExpired ? 'bg-[#fbfcfb] ' : '') +
			' ' +
			className}
	>
		{#if miniatures[aide.ruleName as keyof typeof miniatures]}
			<button
				title="Logo {title.toLowerCase()} (ouvrir le site dans un nouvel onglet)"
				class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#dfe6ef] bg-white p-2 opacity-90 hover:opacity-100 sm:h-14 sm:w-14"
				onclick={() => lien && window.open(lien, '_blank')}
			>
				<img
					src="/miniatures/{miniatures[aide.ruleName as keyof typeof miniatures]}"
					class="max-h-full max-w-full object-contain"
					alt="Logo {title.toLowerCase()}"
				/>
			</button>
		{/if}
		<div class="min-w-0 flex-grow">
			<div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
				<div class="min-w-0">
					<h3 class="mb-2 text-base font-bold text-[#263754]">
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
            font-[800] text-xl text-[#10233a] text-left sm:text-right playwright-{slugify(
						aide.ruleName,
					)}
          "
					data-testid={slugify(aide.ruleName)}
				>
					<AnimatedAmount amount={aide.nodeValue} unit={aide.unit} />
				</div>
			</div>
			<div class="mt-4 text-sm leading-6 text-[#647085] prose-sm">
				<SvelteMarkdown source={notice} options={{ breaks: true }} />
			</div>
			<div class="inline-flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
				{#if lien}
					<p class="mt-4 text-sm font-semibold text-[#16a34a]">
						<a href={lien} target="_blank" class="hover:underline">En savoir plus →</a>
					</p>
				{/if}
				{#if lastUpdate}
					<p class="mt-4 text-[0.7rem] text-[#8b98a8] italic">
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
