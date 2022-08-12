<script context="module">
	export function title(category) {
		if (category === 'motorisation') {
			return 'Motorisation d’un vélo classique';
		}
		return `Achat d’un vélo ${category}`;
	}

	export function emoji(category) {
		if (category === 'motorisation' || title(category).includes('électrique')) {
			return '⚡';
		}
	}
</script>

<script>
	import CategoryLine from '$lib/components/CategoryLine.svelte';
	import Emoji from '$lib/components/Emoji.svelte';
	import { answers, localisation, publicodeSituation } from '$lib/stores';
	import { engine } from '$lib/engine';
	import { formatValue } from 'publicodes';

	const bikeKinds = engine?.getRule('vélo . type').rawNode['possibilités'];

	answers.set({});

	$: aidesPerBikeKind = bikeKinds
		.map((kind) => {
			if (!$localisation) return [];
			engine.setSituation({
				...$publicodeSituation,
				'maximiser les aides': 'oui',
				'vélo . type': `'${kind}'`
			});
			return [kind, engine.evaluate('aides . montant')];
		})
		.map(([cat, node]) => [
			cat,
			{
				label: title(cat),
				emoji: emoji(cat),
				montant: node?.nodeValue ? formatValue(node, { precision: 0 }) : 0
			}
		]);

	$: primeALaConversion = engine
		.setSituation({
			...$publicodeSituation,
			'vélo . type': "''"
		})
		.evaluate('aides . prime à la conversion');

	// TODO: use `groupBy` partition when available
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy
	$: activesAidesPerBikeKind = aidesPerBikeKind.filter(([, { montant }]) => montant !== 0);
	$: inactivesAidesPerBikeKind = aidesPerBikeKind.filter(([, { montant }]) => montant === 0);

	$: inFrance = !!engine
		.setSituation($publicodeSituation)
		.evaluate("localisation . pays = 'France'").nodeValue;

	$: onlyNationalAides =
		inFrance &&
		bikeKinds.every(
			(kind) =>
				!(
					engine
						.setSituation({
							...$publicodeSituation,
							'localisation . pays': "'nawak'",
							'maximiser les aides': 'oui',
							'vélo . type': `'${kind}'`
						})
						.evaluate('aides . montant').nodeValue > 0
				)
		);
</script>

<div class="mt-8" />
<div class="bg-yellow-100 p-2">
	<h3 class="font-bold mb-2 text-orange-900">
		⚠ Les nouvelles aides de l’État au 15 août ne sont pas encore intégrées.
	</h3>
	<p>
		Le détail du calcul des nouvelles aides n’est pas encore connu. Nous attendons la publication
		d’un décrêt en officialisant les conditions d’accès et les modalités de calcul pour mettre à
		jour le site.
	</p>
</div>
<div class="mt-8" />
<p class="mb-3 text-gray-600">Vous pouvez bénéficier des aides suivantes :</p>
<div class="border rounded shadow-md bg-white sm:text-lg">
	{#each activesAidesPerBikeKind as [cat, { montant, label, emoji }]}
		<CategoryLine {montant} href="?velo={cat}"
			>{label}{#if emoji}&nbsp;<Emoji {emoji} />{/if}</CategoryLine
		>
	{/each}
	{#if primeALaConversion.nodeValue}
		<CategoryLine
			montant={formatValue(primeALaConversion, { precision: 0 })}
			href="/prime-a-la-conversion"
			>Prime à la conversion <Emoji emoji="🚗" /> →<Emoji emoji="🚲" /></CategoryLine
		>
	{/if}
	{#if inFrance}
		<CategoryLine montant={'500 €/an'} href="/forfait-mobilite-durable"
			>Forfait mobilités durables
		</CategoryLine>
		{#each inactivesAidesPerBikeKind as [cat, { montant, label }]}
			<CategoryLine {montant} href="?velo={cat}">{label}</CategoryLine>
		{/each}
	{/if}
</div>

{#if onlyNationalAides && $localisation?.nom}
	<p class="mt-8 mx-2 text-gray-700">
		<strong>Note :</strong><br />Les aides affichées sont les aides nationales. Ni la ville de
		{$localisation.nom}, ni le département, ni la région ne proposent d’aides locales.
	</p>
{/if}
