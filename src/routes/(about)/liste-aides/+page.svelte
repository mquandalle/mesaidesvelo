<script>
	import departements from '@etalab/decoupage-administratif/data/departements.json';
	import AideSummary from './AideSummary.svelte';

	/** @type {import('./$types').PageData */
	export let data;
</script>

<div class="prose mt-8 w-full max-w-screen-md m-auto">
	<h1>Les aides intégrées sur le site</h1>
	<p>
		Intégrer des aides est un travail manuel. Contactez-nous si vous constatez une erreur ou un
		oubli !
	</p>

	<h2>Les aides de l’État</h2>
	<ul>
		{#each data.aidesEtat as aide}
			<li>
				{aide.titre}
			</li>
		{/each}
	</ul>
	<p>
		Nous intégrons également les aides de <a href="/ville/monaco" class="hover:text-green-700"
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

	{#each data.aidesLocales as [departement, aides]}
		<h3>{departement} - {departements.find(({ code }) => code === departement).nom}</h3>
		<ul>
			{#each aides as aide}
				<li>
					<AideSummary {aide} />
				</li>
			{/each}
		</ul>
	{/each}
</div>
