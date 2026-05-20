<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AnimatedAmount from '$lib/components/AnimatedAmount.svelte';
	import BikeCategoryIcon, { bikeCategoryImageSlug } from '$lib/components/BikeCategoryIcon.svelte';
	import DetailsLine from '$lib/components/DetailsLine.svelte';
	import Questions from '$lib/components/Questions.svelte';
	import { engine as baseEngine, getEngine } from '$lib/engine';
	import { getSimulation, setSimulationForm } from '$lib/simulation/context.svelte';
	import { SimulationFormState } from '$lib/simulation/state.svelte';
	import { titleCategory } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import Badge from './Badge.svelte';

	const simulation = getSimulation();
	const form = setSimulationForm(new SimulationFormState(simulation));

	let selectedVeloEtat = $state('neuf');
	let engineOccasion = $derived(
		getEngine({
			...form.publicodeSituation,
			...(form.veloTypeValue ? { 'vélo . type': form.veloTypeValue } : {}),
			'vélo . état': `'occasion'`,
		}),
	);
	let montantOccasion = $derived(engineOccasion.evaluate('aides . montant').nodeValue);
	let engineNeuf = $derived(
		getEngine({
			...form.publicodeSituation,
			...(form.veloTypeValue ? { 'vélo . type': form.veloTypeValue } : {}),
			'vélo . état': `'neuf'`,
		}),
	);
	let montantNeuf = $derived(engineNeuf.evaluate('aides . montant').nodeValue);
	let neufOuOccasion = $derived(
		montantNeuf > 0 && montantOccasion > 0
			? selectedVeloEtat
			: montantOccasion > 0
				? 'occasion'
				: 'neuf',
	);
	let engine = $derived(neufOuOccasion === 'neuf' ? engineNeuf : engineOccasion);

	let categoryDescription = $derived(
		form.veloCat ? (baseEngine.getRule(`vélo . ${form.veloCat}`).rawNode?.description ?? '') : '',
	);
	let transitionKey = $derived(bikeCategoryImageSlug(form.veloCat));

	const collectivites = ['commune', 'intercommunalité', 'département', 'région', 'état'];
	let aidesDetails = $derived(
		form.publicodeSituation &&
			collectivites
				.map((collectivite) => {
					const aide = engine.evaluate(`aides . ${collectivite}`);

					if (!aide?.nodeValue) {
						return null;
					}

					const originalRuleName = aide.explanation.find(
						({ condition }) => condition.nodeValue === true,
					).consequence.name;

					if (!originalRuleName) {
						return null;
					}

					return { ruleName: originalRuleName, ...aide };
				})
				.filter(Boolean),
	);

	let sum = $derived(engine.evaluate('aides . montant'));
</script>

<section
	class="mt-8 grid items-start gap-x-5 gap-y-5 sm:grid-cols-[minmax(0,1fr)_300px] sm:items-center"
>
	<a
		class="
		    inline-flex items-center text-sm font-semibold text-[#647085]
		    cursor-pointer
		    hover:text-[#16a34a] transform transition hover:-translate-x-1
				sm:col-start-1
			"
		data-sveltekit-noscroll
		href={resolve(page.url.pathname)}
	>
		← Toutes les aides
	</a>

	<div class="min-w-0 sm:col-start-1">
		<h2
			class="mav-bike-title-transition mb-3 text-3xl leading-[1.05] font-[800] text-[#10233a] sm:text-4xl"
			style={transitionKey ? `--mav-bike-title-transition: mav-bike-title-${transitionKey}` : ''}
		>
			{titleCategory(form.veloCat)}
		</h2>

		{#if categoryDescription}
			<p class="max-w-[680px] text-sm leading-6 text-[#647085]">{categoryDescription}</p>
		{/if}
	</div>

	<BikeCategoryIcon
		category={form.veloCat}
		variant="illustration"
		className="h-36 w-full max-w-[260px] mx-auto object-center sm:h-40 sm:max-w-[300px] sm:mx-0 sm:justify-self-end sm:object-right sm:col-start-2 sm:row-start-1 sm:row-span-3 sm:self-center"
		{transitionKey}
	/>

	<div class="sm:col-start-1">
		{#if montantNeuf > 0 && montantOccasion > 0 && montantNeuf !== montantOccasion}
			<div class="inline-flex rounded-full border border-[#d4ded9] bg-white p-1 shadow-sm">
				<button
					class="
			          rounded-full px-4 py-2 text-sm font-bold {neufOuOccasion === 'neuf'
						? 'bg-[#e5f4ff] text-[#0f5e91]'
						: 'text-[#647085] hover:bg-[#f2f7f5] hover:text-[#263754]'}
			        "
					onclick={() => (selectedVeloEtat = 'neuf')}
				>
					Neuf
				</button>
				<button
					class="
			          rounded-full px-4 py-2 text-sm font-bold {neufOuOccasion === 'occasion'
						? 'bg-[#fff2cf] text-[#8a5b00]'
						: 'text-[#647085] hover:bg-[#f2f7f5] hover:text-[#263754]'}
			        "
					onclick={() => (selectedVeloEtat = 'occasion')}
				>
					D'occasion
				</button>
			</div>
		{:else if montantNeuf > 0 && montantOccasion > 0 && montantNeuf === montantOccasion}
			<Badge className="px-4 py-2 text-[0.875rem]">Neuf ou d'occasion</Badge>
		{:else if montantNeuf}
			<Badge className="bg-sky-50 px-4 py-2 text-[0.875rem] !text-sky-700 border-sky-100">
				Neuf uniquement
			</Badge>
		{:else if montantOccasion}
			<Badge className="bg-amber-50 px-4 py-2 text-[0.875rem] !text-amber-700 border-amber-100">
				D'occasion uniquement
			</Badge>
		{/if}
	</div>
</section>

<div class="mt-6 overflow-hidden rounded border border-[#dfe6ef] bg-white">
	{#each aidesDetails as aide (aide.ruleName)}
		<div transition:slide={{ duration: 200 }} class="border-b border-[#edf1ee] last:border-b-0">
			<DetailsLine veloEtat={neufOuOccasion} {aide} />
		</div>
	{/each}
	<div class="bg-[#fafafa] px-4 py-4 sm:px-5">
		<div class="flex justify-between text-lg">
			<h3 class="text-base font-bold text-[#263754]">Total des aides</h3>
			<div class="font-[800] text-[#10233a]">
				<AnimatedAmount amount={sum.nodeValue} unit={sum.unit} />
			</div>
		</div>
	</div>
</div>

<Questions veloEtat={neufOuOccasion} />
