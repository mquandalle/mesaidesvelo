<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import DetailsLine from './DetailsLine.svelte';
	import Emoji from './Emoji.svelte';
	import { engine } from './Results.svelte';
	import { localisationPublicodesSituation } from '$lib/stores/localisation';

	const veloCat = $page.query.get('velo');
	let bikePrice = '';

	$: getEngine = () => {
		if (!$localisationPublicodesSituation) {
			return engine;
		}
		const cleanedBikePrice = parseInt(bikePrice.replace(/[^0-9]/g, ''));
		engine.setSituation({
			...$localisationPublicodesSituation,
			'vélo . type': `'${veloCat}'`,
			...(cleanedBikePrice ? { 'vélo . prix': `${cleanedBikePrice} €` } : {})
		});
		return engine;
	};

	const defaultDescription = '';

	const collectivites = ['commune', 'département', 'région', 'état'];
	$: aidesDetails = collectivites
		.map((collectivite) => {
			const aide = getEngine().evaluate(`aides . ${collectivite}`);
			if (!aide.nodeValue) {
				return null;
			}
			const originalRuleName = aide.explanation.find(({ satisfied }) => satisfied).consequence.name;
			const { title, rawNode } = engine.getRule(originalRuleName);
			const description = rawNode.description ?? defaultDescription;
			const plafond = rawNode.plafond && engine.evaluate(rawNode.plafond);
			const notice = description
				.replace(/\$vélo/g, `vélo ${veloCat}`)
				.replace(
					/\$plafond/,
					window.publicodes.formatValue(plafond?.nodeValue, { displayedUnit: '€' })
				);
			return {
				title,
				link: rawNode.lien,
				notice,
				montant: window.publicodes.formatValue(aide, { precision: 0 }),
				// TODO: L'idée était initialement d'utilisr les missingsVariable pour détecter
				// si "revenu fiscal de référence" était utilisé dans le calcul de l'aide, mais
				// cela ne fonctionne pas, sans doute à cause des remplacement qui font remonter
				// l'ensemble des missingVariables de l'ensemble des branches
				conditionDeRessources: rawNode['condition de ressources'] === 'oui'
			};
		})
		.filter(Boolean);

	$: sum = window.publicodes.formatValue(getEngine().evaluate('aides'), { precision: 0 });
</script>

<div class="mt-8" />

<span
	class="inline-block text-gray-500 text-md 
    cursor-pointer
    hover:text-green-700 transform transition hover:-translate-x-1"
	on:click={() => goto('/', { noscroll: true })}
>
	← Toutes les aides
</span>
<h2 class="font-bold mt-2 mb-5 text-gray-900 text-xl">
	Aides à l’achat d’un vélo {veloCat}
	{#if veloCat.includes('électrique')} <Emoji emoji="⚡" />{/if}
</h2>

<div class="border mt-6 rounded-md shadow-sm">
	{#each aidesDetails as aide}
		<DetailsLine {aide} />
	{/each}
	<div class="p-4 bg-gray-50 rounded-b-md">
		<div class="flex justify-between text-lg">
			<h3 class="font-semibold text-md">Total des aides</h3>
			<div class="font-bold">{sum}</div>
		</div>
		{#if false}
			<div class="flex justify-between text-lg mt-3 text-gray-600" transition:slide|local>
				<h3 class="font-semibold text-sm">Reste à charge</h3>
				<div class="font-semibold text-sm">XXX €</div>
			</div>
		{/if}
	</div>
</div>

<div class="border-l-4 mt-8 border-green-100 pl-4 py-3">
	<div
		class="inline-block relative -left-8.5 bg-white border-4 border-green-100 w-8 h-8 rounded-full font-bold text-green-200 text-center leading-6"
	>
		€
	</div>
	<p class="text-gray-600 text-md -mt-7 pl-3 mb-8 italic">Affinez le calcul :</p>
	<div class="border inline-flex flex-col rounded p-2 items-start shadow-sm ">
		<label for="velo-prix" class="relative -top-5 px-2 -mb-5 bg-white">Prix du vélo</label>
		<div>
			<input
				placeholder="1 500"
				type="text"
				id="velo-prix"
				maxlength="5"
				class="text-right focus:outline-transparent"
				bind:value={bikePrice}
			/>
			<span class="text-gray-600">€</span>
		</div>
	</div>
</div>
