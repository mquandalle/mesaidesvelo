<script>
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';

	const googleFormURL =
		'https://docs.google.com/forms/d/e/1FAIpQLSeES7UU67CKAO2y5lzOwy6Q_8cLiPab_sywWIO3mOYa_xVQFA/viewform';

	const prefillGoogleFormURL = (company) =>
		googleFormURL + '?entry.216851643=' + encodeURIComponent(company);

	/** @type {import('./$types').PageData */
	export let data;

	let entreprises = data.entreprises;
	let searchEntreprise = '';

	async function loadResults(keyword) {
		const url = `/api/entreprises?search=${encodeURIComponent(keyword)}`;
		const response = await fetch(url);
		entreprises = await response.json();
	}

	$: typeof window !== 'undefined' && loadResults(searchEntreprise);
</script>

<div class="w-full max-w-screen-md m-auto">
	<div class="mt-8" />
	<BackButtonAides />
	<h1 class="mt-4 text-3xl font-semibold text-gray-800">
		Le <span class="text-green-800">Forfait Mobilités Durables</span>
	</h1>
	<p class="text-gray-900 mt-2">
		Votre employeur peut prendre en charge les frais liés à vos déplacements domicile-travail
		réalisés à vélo. Le montant est forfaitaire et dépend de chaque employeur.
	</p>

	<h2 class="font-semibold text-xl mt-12">Je travaille dans le secteur public</h2>

	<div class="border mt-4 p-4 bg-white rounded-md shadow-sm">
		<div class="flex flex-col sm:flex-row-reverse gap-x-8 text-lg">
			<dl class="flex flex-row sm:flex-col gap-x-3 mb-2 items-center sm:items-start">
				<dt class="sm:text-xs text-gray-600">Montant du forfait</dt>
				<dt class="font-bold text-gray-800 text-right whitespace-nowrap">200 €/an</dt>
			</dl>
			<div class="text-gray-700 flex-1 text-sm">
				<p class="">Les agents publics bénéficient d’un forfait de 200 € par an. Cela concerne :</p>
				<ul class="list-disc ml-4 mt-1">
					<li>les fonctionnaires</li>
					<li>les contractuels</li>
					<li>la fonction publique hospitalière</li>
					<li>la fonction publique territoriale</li>
				</ul>
				<p class="mt-2 text-sm text-green-700">
					<a
						href="https://www.fonction-publique.gouv.fr/forfait-mobilites-durables-de-200-euros-par-an-pour-trajets-domicile-travail-des-agents"
						target="_blank"
						class="hover:underline">→ En savoir plus</a
					>
				</p>
			</div>
		</div>
	</div>

	<h2 class="font-semibold text-xl mt-12">Je travaille dans le secteur privé</h2>
	<p class="text-gray-600 text-base mt-2 text-sm">
		Pour les salariés du secteur privé, le montant du forfait dépend de chaque employeur. Retrouvez
		votre entreprise dans la liste ci-dessous et comparez le montant qu'elle vous verse à celui des
		concurrents !
	</p>

	<div class="flex flex-col border mt-6 bg-white rounded-md shadow-sm">
		<label class="block bg-gray-50 p-4 border-b"
			>Votre entreprise :<br />
			<input
				type="text"
				placeholder="EDF, Renault..."
				bind:value={searchEntreprise}
				class="border focus:border-green-400 bg-white p-2 rounded w-full shadow-sm mt-1"
			/>
		</label>

		<table class="text-left m-4">
			<tr>
				<th class="p-1 py-2">Entreprise</th>
				<th class="p-1 py-2">Plafond du forfait</th>
			</tr>
			{#each entreprises as entreprise}
				<tr class="odd:bg-green-50">
					<td class="p-1 py-2"
						><div class="max-h-[1.5em] overflow-hidden">
							{entreprise.nom}
						</div></td
					>
					<td class="p-1 py-2 flex">
						<span class="flex-1">
							{#if entreprise.forfaitMax === undefined}
								<span class="italic">inconnu</span>
							{:else if entreprise.forfaitMax === 0}
								<span class="italic">pas de forfait</span>
							{:else}
								{entreprise.forfaitMax} €/an
							{/if}
							{#if entreprise.commentaire || entreprise.reference}
								<span class="text-xs text-gray-600 block leading-4"
									>{entreprise.commentaire}
									<a
										class="text-green-800 whitespace-nowrap hover:(text-green-600 underline)"
										href={entreprise.reference}
										target="_blank">plus d’infos</a
									>
								</span>
							{/if}
						</span>
						<a
							href={prefillGoogleFormURL(entreprise.nom)}
							target="_blank"
							title="Éditer cette entreprise"
							class="inline-block self-center ml-2 border px-2 py-1 whitespace-nowrap sm:px-3 -my-0.5 rounded-xl bg-gray-50 text-gray-600 hover:(bg-green-100 text-green-900 border-green-500 font-semibold)"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								class="inline"
								><path
									class="fill-current"
									d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L13.4 6.41 3 16.82V21h4.18l10.46-10.46 2.77-2.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z"
								/></svg
							>
							<span class="text-xs hidden sm:inline-block ml-1">Éditer</span>
						</a>
					</td>
				</tr>
			{/each}
		</table>

		<p class="m-4 mt-2">
			Mon entreprise n’est pas dans la liste. <a
				href={googleFormURL}
				target="_blank"
				class="text-green-700 whitespace-nowrap hover:underline">Ajouter une entreprise</a
			>
		</p>
	</div>
	<section class="prose mt-10">
		<h2 class="font-bold !text-xl">Comment mettre en place le forfait mobilités durables ?</h2>
		<p>
			Le forfait mobilités durables est instauré par un
			<em>accord d’entreprise</em>
			ou par une
			<em>décision unilatérale de l’employeur</em>. Il doit bénéficer à l’ensemble des salariés sous
			les même conditions.
		</p>
		<p>
			Ce dispositif existe depuis 2020 et remplace le précédent mécanisme des «&nbsp;indémnités
			kilométriques vélos&nbsp;» dont le mode de calcul était plus compliqué.
		</p>
		<h2 class="!font-bold !text-xl">Quel est le montant maximal du forfait ?</h2>
		<p>
			Le montant maximal du forfait est de 700 € par an. Ce plafond a été relevé à titre dérogatoire
			pour les revenus déclarés en 2022 et 2023 et devrait revenir à 500 € à partir de 2024.
		</p>
		<p>
			Son gros avantage pour l’employeur comme pour le salarié est qu'il bénéficie d’une <em
				>exonération d’impôt sur le revenu et des cotisations Urssaf</em
			>. Il est théoriquement possible de verser un forfait supérieur à 700 € mais il faudra alors
			payer des impôts et des cotisations sur la part dépassant ce seuil.
		</p>
		<h2 class="!font-bold !text-xl">Puis-je le cumuler avec d’autres dispositifs ?</h2>
		<p>
			Oui, le forfait mobilités durables peut-être cumulé avec le remboursement des frais de
			transports. Dans ce cas, le montant maximal exonéré d’impôts et de cotisations est porté à 800
			€ par an.
		</p>
	</section>
</div>
