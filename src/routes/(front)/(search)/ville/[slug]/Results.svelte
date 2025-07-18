<script>
	import { BIKE_KINDS } from '$lib/aides-velo-utils';
	import Emoji from '$lib/components/Emoji.svelte';
	import Question from '$lib/components/Question.svelte';
	import RevenuSelector from '$lib/components/RevenuSelector.svelte';
	import { getEngine } from '$lib/engine';
	import { publicodeSituation, resetAnswers } from '$lib/stores';
	import { emojiCategory, titleCategory } from '$lib/utils';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import CategoryLine from './CategoryLine.svelte';

	resetAnswers();

	$: engine = getEngine($publicodeSituation);
	$: engineBis = getEngine($publicodeSituation);
	$: aidesPerBikeKind = BIKE_KINDS.map((cat) => {
		engineBis.setSituation({
			...$publicodeSituation,
			'maximiser les aides': 'oui',
			'vélo . type': `'${cat}'`,
		});

		const montant = engineBis.evaluate('aides . montant');

		return {
			cat,
			label: titleCategory(cat),
			emoji: emojiCategory(cat),
			montant,
		};
	});

	// TODO: use `groupBy` partition when available
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
	$: activesAidesPerBikeKind = aidesPerBikeKind.filter(({ montant }) => montant.nodeValue !== 0);
	$: inactivesAidesPerBikeKind = aidesPerBikeKind.filter(({ montant }) => montant.nodeValue === 0);

	$: inFrance = !!engine.evaluate("localisation . pays = 'France'").nodeValue;

	$: displayedAides = [
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
			},
			...inactivesAidesPerBikeKind.map(({ cat, ...rest }) => ({
				...rest,
				href: `?velo=${cat}`,
				emoji: null,
			})),
		],
	]
		.filter(Boolean)
		.flat();
	$: nbAides = displayedAides.length;
</script>

<div class="mt-10" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<div role="table" class="flex flex-col bg-white border rounded sm:text-lg">
	{#each displayedAides as { montant, href, label, emoji, relNoFollow }, idx (label)}
		<div animate:flip={{ duration: 600, easing: quintOut }}>
			<CategoryLine isFirst={idx === 0} isLast={idx === nbAides - 1} {montant} {href} {relNoFollow}
				>{label}{#if emoji}&nbsp;<Emoji {emoji} />{/if}</CategoryLine
			>
		</div>
	{/each}
</div>
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
		<Question rule={'demandeur . en situation de handicap'} {engine} />
	</div>
{/if}
