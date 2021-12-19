<script>
	import { engine } from '$lib/engine';
	import { reduceAST } from 'publicodes';
	import publicodesRules from '../aides.yaml';
	import communes from '../data/communes.json';
	import departements from '@etalab/decoupage-administratif/data/departements.json';
	import regions from '@etalab/decoupage-administratif/data/regions.json';

	const aidesRuleNames = Object.keys(publicodesRules).filter(
		(ruleName) => ruleName.startsWith('aides .') && publicodesRules[ruleName].titre
	);

	const extractCollectivityFromAST = (rule) => {
		const localisationKinds = ['pays', 'région', 'département', 'epci', 'code insee'];
		return reduceAST(
			(acc, node) => {
				if (acc) return acc;
				if (node.nodeKind === 'operation' && node.operationKind === '=') {
					for (let localisationKind of localisationKinds) {
						if (node.explanation[0]?.dottedName === `localisation . ${localisationKind}`) {
							return {
								kind: localisationKind,
								value: node.explanation[1]?.nodeValue
							};
						}
					}
				}
			},
			null,
			rule
		);
	};

	const communesSorted = communes.sort((a, b) => b.population - a.population);

	const getCodeInseeForCollectivity = ({ kind, value }) => {
		switch (kind) {
			case 'région':
				return regions.find(({ code }) => code === value)?.chefLieu;
			case 'département':
				return departements.find(({ code }) => code === value).chefLieu;
			case 'epci':
				return communesSorted.find(({ epci }) => epci?.replace(/'/g, '’') === value)?.code;
			case 'code insee':
				return value;
		}
	};

	const getSlugForCodeInsee = (codeInsee) =>
		codeInsee && communesSorted.find(({ code }) => code === codeInsee)?.slug;

	const associateCollectivityMetadata = (ruleName) => {
		const rule = engine.getRule(ruleName);
		const collectivity = extractCollectivityFromAST(rule);
		const codeInsee = getCodeInseeForCollectivity(collectivity);
		const slug = getSlugForCodeInsee(codeInsee);
		return {
			...rule,
			collectivity,
			codeInsee,
			slug
		};
	};

	const groupBy = (list, f) =>
		list.reduce((acc, elm) => {
			const key = f(elm);
			return {
				...acc,
				[key]: [...(acc[key] ?? []), elm]
			};
		}, {});

	const associatedCollectivities = aidesRuleNames.map(associateCollectivityMetadata);

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

	<h2>Les aides de l'État</h2>
	<ul>
		{#each aidesEtat as aide}
			<li>{aide.rawNode.titre.replace(/de l’état/i, '').trim()}</li>
		{/each}
	</ul>
	<p>
		Nous intégrons également les aides de <a
			href="/ville/monaco"
			class="!font-normal hover:text-green-700">Monaco</a
		>.
	</p>
	<h2>Les aides régionales</h2>
	<ul>
		{#each aidesRegions as aide}
			<li>
				<a href="/ville/{aide.slug}" class="!font-normal hover:text-green-700"
					>{aide.rawNode.titre.replace(/région/i, '').trim()}</a
				>
			</li>
		{/each}
	</ul>
	<h2>Les aides locales</h2>

	{#each Object.entries(aidesLocales).sort(([a], [b]) => parseInt(a) - parseInt(b)) as [departement, aides]}
		<h3>{departement} - {departements.find(({ code }) => code === departement).nom}</h3>
		<ul>
			{#each aides as aide}
				<li>
					{#if aide.slug}
						<a href="/ville/{aide.slug}" class="!font-normal hover:text-green-700"
							>{aide.rawNode.titre}</a
						>
					{:else}
						{aide.rawNode.titre}
					{/if}
				</li>
			{/each}
		</ul>
	{/each}
</div>
