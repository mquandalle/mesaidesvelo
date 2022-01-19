<script>
	import AideSummary from '$lib/components/AideSummary.svelte';
	import { engine } from '$lib/engine';
	import departements from '@etalab/decoupage-administratif/data/departements.json';
	import aidesCollectivities from '$lib/data/aides-collectivities.json';

	const groupBy = (list, f) =>
		list.reduce((acc, elm) => {
			const key = f(elm);
			return {
				...acc,
				[key]: [...(acc[key] ?? []), elm]
			};
		}, {});

	const associatedCollectivities = Object.keys(aidesCollectivities).map((ruleName) => ({
		...engine.getRule(ruleName),
		...aidesCollectivities[ruleName]
	}));

	const aidesEtat = associatedCollectivities.filter(
		({ collectivity }) => collectivity.kind === 'pays' && collectivity.value === 'France'
	);

	const aidesRegions = associatedCollectivities.filter(
		({ collectivity }) => collectivity.kind === 'région'
	);

	const aidesLocales = groupBy(
		associatedCollectivities.filter(({ collectivity }) =>
			['code insee', 'epci', 'département'].includes(collectivity.kind)
		),
		function getDepartement({ codeInsee }) {
			return codeInsee?.slice(0, 2);
		}
	);
</script>

<div class="prose mt-8 w-full max-w-screen-md m-auto">
	<h1>Les aides intégrées sur le site</h1>
	<p>
		Intégrer des aides est un travail manuel. Contactez-nous si vous constatez une erreur ou un
		oubli !
	</p>

	<h2>Les aides de l’État</h2>
	<ul>
		{#each aidesEtat as aide}
			<li>
				{aide.rawNode.titre.replace(/de l’état/i, '').trim()}
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
		{#each aidesRegions as aide}
			<li>
				<AideSummary {aide} />
			</li>
		{/each}
	</ul>
	<h2>Les aides locales</h2>

	{#each Object.entries(aidesLocales).sort(([a], [b]) => parseInt(a) - parseInt(b)) as [departement, aides]}
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
