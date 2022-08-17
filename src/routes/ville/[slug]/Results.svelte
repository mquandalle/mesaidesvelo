<script>
	import Emoji from '$lib/components/Emoji.svelte';
	import RevenuSelector, { originalNames } from '$lib/components/RevenuSelector.svelte';
	import { engine } from '$lib/engine';
	import { localisation, publicodeSituation, resetAnswers } from '$lib/stores';
	import { emojiCategory, titleCategory } from '$lib/utils';
	import { getContext } from 'svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import CategoryLine from './CategoryLine.svelte';
	import SeoText from './SEOText.svelte';

	const bikeKinds = engine?.getRule('vélo . type').rawNode['possibilités'];
	const embeded = getContext('embeded');

	resetAnswers();

	$: aidesPerBikeKind = bikeKinds.map((cat) => {
		engine.setSituation({
			...$publicodeSituation,
			'maximiser les aides': 'oui',
			'vélo . type': `'${cat}'`
		});

		const montant = engine.evaluate('aides . montant');

		return {
			cat,
			label: titleCategory(cat),
			emoji: emojiCategory(cat),
			montant
		};
	});

	$: primeALaConversion = engine
		.setSituation({
			...$publicodeSituation,
			'vélo . type': "''"
		})
		.evaluate('aides . prime à la conversion');

	// TODO: use `groupBy` partition when available
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
	$: activesAidesPerBikeKind = aidesPerBikeKind.filter(({ montant }) => montant.nodeValue !== 0);
	$: inactivesAidesPerBikeKind = aidesPerBikeKind.filter(({ montant }) => montant.nodeValue === 0);

	$: inFrance = !!engine
		.setSituation($publicodeSituation)
		.evaluate("localisation . pays = 'France'").nodeValue;

	$: displayedAides = [
		...activesAidesPerBikeKind.map(({ cat, ...rest }) => ({
			...rest,
			href: `?velo=${cat}`
		})),
		primeALaConversion.nodeValue && {
			montant: primeALaConversion,
			href: '/prime-a-la-conversion',
			label: 'Prime à la conversion',
			emoji: '🚗'
		},
		inFrance && [
			{
				montant: engine.evaluate('aides . forfait mobilités durables'),
				href: '/forfait-mobilite-durable',
				label: 'Forfait mobilités durables'
			},
			...inactivesAidesPerBikeKind.map(({ cat, ...rest }) => ({
				...rest,
				href: `?velo=${cat}`,
				emoji: null
			}))
		]
	]
		.filter(Boolean)
		.flat();

	$: onlyNationalAides =
		$originalNames.filter((name) => !name.startsWith('aides . bonus')).length === 0;
</script>

<div class="mt-8" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<table class="flex flex-col-reverse bg-white border-t rounded-t sm:text-lg">
	{#each displayedAides.reverse() as { montant, href, label, emoji } (label)}
		<tbody animate:flip={{ duration: 600, easing: quintOut }}>
			<CategoryLine {montant} {href}
				>{label}{#if emoji}&nbsp;<Emoji {emoji} />{/if}</CategoryLine
			>
		</tbody>
	{/each}
</table>
{#if inFrance}
	<div class="border-l-4 border-green-200 pl-4 py-4 ml-4">
		<div
			class="inline-block relative -left-8 bg-white border-4 border-green-200 w-8 h-8 rounded-full font-bold text-green-300 text-center leading-6"
		>
			€
		</div>
		<p class="text-gray-600 text-md -mt-7 pl-3 italic">
			Répondez à la question pour calculer les aides disponibles :
		</p>
		<RevenuSelector />
	</div>
{/if}

{#if !embeded && $localisation?.nom === 'Bordeaux'}
	<SeoText />
{/if}

{#if onlyNationalAides && $localisation?.nom}
	<p class="mt-8 mx-2 text-gray-700">
		<strong>Note :</strong><br />Les aides affichées sont les aides nationales. Ni la ville de
		{$localisation.nom}, ni le département, ni la région ne proposent d’aides locales.
	</p>
{/if}
