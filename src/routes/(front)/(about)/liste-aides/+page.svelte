<script>
	import { allAides } from '$lib/aides-velo-utils';
	import { slugify } from '$lib/utils';
	import departements from '@etalab/decoupage-administratif/data/departements.json';
	import AideSummary from './AideSummary.svelte';

	/** @type {import('./$types').PageData */
	export let data;
</script>

<svelte:head>
	<title>MesAidesVélo - Liste des aides</title>
</svelte:head>

<div class="prose mt-8 w-full max-w-screen-md m-auto">
	<h1>Les aides intégrées sur le site</h1>
	<p>
		Actuellement, <strong>{allAides.length} aides sont reférencées</strong> sur le site. Intégrer
		des aides est un travail fastidieux et manuel.
		<a href="mailto:emile@calinou.coop" target="_blank">Contactez-nous</a> si vous constatez une erreur
		ou un oubli !
	</p>

	<p></p>
	<h2>Les aides de l’État</h2>
	<p>Il n'existe plus d'aide de l'État en France pour l'achat d'un vélo.</p>
	<p>
		Cependant, nous intégrons les aides de <a href="/ville/monaco" class="hover:text-green-700"
			>Monaco</a
		>
		et du <a href="/ville/luxembourg">Luxembourg</a>.
	</p>
	<h2>Les aides régionales</h2>
	<ul>
		{#each data.aidesRegions as aide}
			<li>
				<AideSummary {aide} />
			</li>
		{/each}
	</ul>
	<h2>Les aides locales</h2>

	{#each departements.filter(({ code }) => code.length === 2 && code !== '2A' && code !== '2B') as departement}
		<h3>
			<a href="/departement/{slugify(departement.nom)}">{departement.code} - {departement.nom}</a>
		</h3>
		{@const aides = data.aidesLocales[departement.code]}
		{#if aides}
			<ul>
				{#each aides as aide}
					<li>
						<AideSummary {aide} />
					</li>
				{/each}
			</ul>
		{:else}
			<p class="italic">Pas d’aide locale référencée dans ce département.</p>
		{/if}
	{/each}
</div>
