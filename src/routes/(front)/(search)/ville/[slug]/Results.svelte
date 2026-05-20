<script>
	import { BIKE_KINDS } from '$lib/aides-velo-utils';
	import Question from '$lib/components/Question.svelte';
	import RevenuSelector from '$lib/components/RevenuSelector.svelte';
	import { getEngine } from '$lib/engine';
	import { getSimulation, setSimulationForm } from '$lib/simulation/context.svelte';
	import { SimulationFormState } from '$lib/simulation/state.svelte';
	import { titleCategory } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import CategoryLine from './CategoryLine.svelte';

	const simulation = getSimulation();
	const form = setSimulationForm(new SimulationFormState(simulation));

	let engine = $derived(getEngine(form.publicodeSituation));
	let engineBis = $derived(getEngine(form.publicodeSituation));
	let aidesPerBikeKind = $derived(
		BIKE_KINDS.map((cat) => {
			engineBis.setSituation({
				...form.publicodeSituation,
				'maximiser les aides': 'oui',
				'vélo . type': `'${cat}'`,
			});

			const montant = engineBis.evaluate('aides . montant');

			return {
				cat,
				label: titleCategory(cat),
				iconCategory: cat,
				montant,
			};
		}),
	);

	// TODO: use `groupBy` partition when available
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
	let activesAidesPerBikeKind = $derived(
		aidesPerBikeKind.filter(({ montant }) => montant.nodeValue !== 0),
	);
	let inactivesAidesPerBikeKind = $derived(
		aidesPerBikeKind.filter(({ montant }) => montant.nodeValue === 0),
	);

	let inFrance = $derived(!!engine.evaluate("localisation . pays = 'France'").nodeValue);

	let displayedAides = $derived(
		[
			...activesAidesPerBikeKind.map(({ cat, ...rest }) => ({
				...rest,
				relNoFollow: true,
				href: `?velo=${cat}`,
			})),
			inFrance && [
				{
					montant: engine.evaluate('aides . forfait mobilités durables'),
					href: '/forfait-mobilite-durable',
					label: 'Forfait mobilités durables',
					iconCategory: 'forfait-mobilites-durables',
				},
				...inactivesAidesPerBikeKind.map(({ cat, ...rest }) => ({
					...rest,
					href: `?velo=${cat}`,
				})),
			],
		]
			.filter(Boolean)
			.flat(),
	);
</script>

<p class="mt-12 mb-4 text-lg text-[#647085]">Vous pourriez bénéficier des aides suivantes&nbsp;:</p>

<div role="list" class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
	{#each displayedAides as { montant, href, label, iconCategory, relNoFollow } (label)}
		<div class="h-full" animate:flip={{ duration: 600, easing: quintOut }}>
			<CategoryLine {montant} {href} {relNoFollow} {iconCategory}>
				{label}
			</CategoryLine>
		</div>
	{/each}
</div>
{#if inFrance}
	<section class="mt-6 border-l-4 border-[#86efac] py-4 pl-4">
		<p class="text-base italic text-[#647085]">
			Répondez à la question pour calculer les aides disponibles :
		</p>
		<RevenuSelector />
		<Question rule={'demandeur . en situation de handicap'} {engine} />
	</section>
{/if}
