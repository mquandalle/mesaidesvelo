<script lang="ts">
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';
	import BikeCategoryIcon from '$lib/components/BikeCategoryIcon.svelte';

	const transitionKey = 'forfait-mobilites-durables';
</script>

<div class="mx-auto w-full max-w-screen-md">
	<section class="mt-8 grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_300px]">
		<div class="flex min-w-0 flex-col items-start">
			<BackButtonAides />
			<div class="mt-5">
				<h1
					class="mav-bike-title-transition text-3xl leading-[1.05] font-[800] text-[#10233a] sm:text-4xl"
					style={`--mav-bike-title-transition: mav-bike-title-${transitionKey}`}
				>
					Le <span class="text-[#16a34a]">Forfait Mobilités Durables</span>
				</h1>
				<p class="mt-4 max-w-[680px] text-base leading-7 text-[#647085]">
					Votre employeur peut prendre en charge les frais liés à vos déplacements domicile-travail
					réalisés à vélo. Le montant est forfaitaire et dépend de chaque employeur.
				</p>
			</div>
		</div>
		<BikeCategoryIcon
			category="forfait-mobilites-durables"
			variant="illustration"
			className="h-32 w-full max-w-[260px] justify-self-end object-right sm:h-44 sm:max-w-[300px]"
			{transitionKey}
		/>
	</section>

	<h2 class="mt-12 text-2xl font-[800] text-[#10233a]">Je travaille dans le secteur public</h2>

	<div class="mt-4 rounded-lg border border-[#dfe6ef] bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-x-8 gap-y-4 text-lg sm:flex-row-reverse">
			<dl class="mb-2 flex flex-row items-center gap-x-3 sm:flex-col sm:items-start">
				<dt class="text-sm font-semibold text-[#647085] sm:text-xs">Montant du forfait</dt>
				<dt class="text-right text-2xl font-[800] whitespace-nowrap text-[#10233a]">300 €/an</dt>
			</dl>
			<div class="flex-1 text-sm leading-6 text-[#647085]">
				<p class="">
					Les agents publics bénéficient d’un forfait de <strong>100 € à 300 € par an</strong> en fonction
					nombre de déplacements. Cela concerne :
				</p>
				<ul class="list-disc ml-4 mt-1">
					<li>les fonctionnaires</li>
					<li>les contractuels</li>
					<li>la fonction publique hospitalière</li>
					<li>la fonction publique territoriale</li>
				</ul>
				<p class="mt-3 text-sm font-bold text-[#16a34a]">
					<a
						href="https://www.ecologie.gouv.fr/politiques-publiques/faq-forfait-mobilites-durables-fmd"
						target="_blank"
						class="hover:underline">En savoir plus →</a
					>
				</p>
			</div>
		</div>
	</div>

	<h2 class="mt-12 text-2xl font-[800] text-[#10233a]">Je travaille dans le secteur privé</h2>
	<!-- NOTE(@EmileRolley): I decided to hide this part as I doesn't have control over the data and it was promoting non-ethical companies. -->
	<!-- <p class="text-gray-600 text-base mt-2 text-sm"> -->
	<!-- 	Pour les salariés du secteur privé, le montant du forfait dépend de chaque employeur. Retrouvez -->
	<!-- 	votre entreprise dans la liste ci-dessous et comparez le montant qu'elle vous verse à celui des -->
	<!-- 	concurrents ! -->
	<!-- </p> -->
	<!---->
	<!-- <div class="flex flex-col border mt-6 bg-white rounded-md shadow-xs"> -->
	<!-- 	<label class="block bg-gray-50 p-4 border-b" -->
	<!-- 		>Votre entreprise :<br /> -->
	<!-- 		<input -->
	<!-- 			type="text" -->
	<!-- 			placeholder="EDF, Renault..." -->
	<!-- 			bind:value={searchEntreprise} -->
	<!-- 			class="border focus:border-green-400 bg-white p-2 rounded w-full shadow-xs mt-1" -->
	<!-- 		/> -->
	<!-- 	</label> -->
	<!---->
	<!-- 	<table class="text-left m-4"> -->
	<!-- 		<tr> -->
	<!-- 			<th class="p-1 py-2">Entreprise</th> -->
	<!-- 			<th class="p-1 py-2">Plafond du forfait</th> -->
	<!-- 		</tr> -->
	<!-- 		{#each entreprises as entreprise} -->
	<!-- 			<tr class="odd:bg-green-50"> -->
	<!-- 				<td class="p-1 py-2"> -->
	<!-- 					<div class="max-h-[1.5em] overflow-hidden"> -->
	<!-- 						{entreprise.nom} -->
	<!-- 					</div> -->
	<!-- 				</td> -->
	<!-- 				<td class="p-1 py-2 flex"> -->
	<!-- 					<span class="flex-1"> -->
	<!-- 						{#if entreprise.forfaitMax === undefined} -->
	<!-- 							<span class="italic">inconnu</span> -->
	<!-- 						{:else if entreprise.forfaitMax === 0} -->
	<!-- 							<span class="italic">pas de forfait</span> -->
	<!-- 						{:else} -->
	<!-- 							{entreprise.forfaitMax} €/an -->
	<!-- 						{/if} -->
	<!-- 						{#if entreprise.commentaire || entreprise.reference} -->
	<!-- 							<span class="text-xs text-gray-600 block leading-4" -->
	<!-- 								>{entreprise.commentaire} -->
	<!-- 								<a -->
	<!-- 									class="text-green-800 whitespace-nowrap hover:text-green-600 hover:underline" -->
	<!-- 									href={entreprise.reference} -->
	<!-- 									target="_blank">plus d’infos</a -->
	<!-- 								> -->
	<!-- 							</span> -->
	<!-- 						{/if} -->
	<!-- 					</span> -->
	<!-- 					<a -->
	<!-- 						href={prefillGoogleFormURL(entreprise.nom)} -->
	<!-- 						target="_blank" -->
	<!-- 						title="Éditer cette entreprise" -->
	<!-- 						class="inline-block self-center ml-2 border px-2 py-1 whitespace-nowrap sm:px-3 -my-0.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-green-100 hover:text-green-900 hover:border-green-500 hover:font-semibold" -->
	<!-- 					> -->
	<!-- 						<svg -->
	<!-- 							xmlns="http://www.w3.org/2000/svg" -->
	<!-- 							width="16" -->
	<!-- 							height="16" -->
	<!-- 							viewBox="0 0 24 24" -->
	<!-- 							class="inline" -->
	<!-- 						> -->
	<!-- 							<path -->
	<!-- 								class="fill-current" -->
	<!-- 								d="M20.41 4.94l-1.35-1.35c-.78-.78-2.05-.78-2.83 0L13.4 6.41 3 16.82V21h4.18l10.46-10.46 2.77-2.77c.79-.78.79-2.05 0-2.83zm-14 14.12L5 19v-1.36l9.82-9.82 1.41 1.41-9.82 9.83z" -->
	<!-- 							/> -->
	<!-- 						</svg> -->
	<!-- 						<span class="text-xs hidden sm:inline-block ml-1">Éditer</span> -->
	<!-- 					</a> -->
	<!-- 				</td> -->
	<!-- 			</tr> -->
	<!-- 		{/each} -->
	<!-- 	</table> -->
	<!---->
	<!-- 	<p class="m-4 mt-2"> -->
	<!-- 		Mon entreprise n’est pas dans la liste. <a -->
	<!-- 			href={googleFormURL} -->
	<!-- 			target="_blank" -->
	<!-- 			class="text-green-700 whitespace-nowrap hover:underline">Ajouter une entreprise</a -->
	<!-- 		> -->
	<!-- 	</p> -->
	<!-- </div> -->
	<section class="prose mt-10">
		<h3 class="!font-bold">Quel est le montant maximal du forfait ?</h3>
		<p>
			Depuis le 1er janvier 2025, le montant maximal du forfait est de <strong>900 € par an</strong>
			en cas de cumul avec un abonnement de transport, sinon, le maximum est de
			<strong>600 € par an</strong>.
		</p>
		<p>
			Son gros avantage pour l’employeur comme pour le salarié est qu'il bénéficie d’une <em
				>exonération d’impôt sur le revenu et des cotisations Urssaf</em
			>. Il est théoriquement possible de verser un forfait supérieur à 900 € mais il faudra alors
			payer des impôts et des cotisations sur la part dépassant ce seuil.
		</p>
		<p class="mt-2 text-sm font-bold text-[#16a34a]">
			<a
				href="https://www.ecologie.gouv.fr/politiques-publiques/faq-forfait-mobilites-durables-fmd"
				target="_blank"
				class="mt-2 text-sm !text-[#16a34a] hover:underline">En savoir plus →</a
			>
		</p>
		<h3 class="font-bold">Comment mettre en place le forfait mobilités durables ?</h3>
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
	</section>
</div>
