<script>
	import geojson from '$lib/data/departements-version-simplifiee.json';
	import aidesCollectivites from '$lib/data/aides-collectivities.json';
	import { scaleQuantile } from 'd3-scale';
	import { schemeGreens } from 'd3-scale-chromatic';
	import Map from './Map.svelte';
	import { slide } from 'svelte/transition';

	const enrichGeojson = geojson.features.map((feature) => {
		const departemenetCode = feature.properties.code;
		const nbAides = Object.entries(aidesCollectivites).filter(
			([_, aide]) => aide.collectivity.kind !== 'région' && aide.departement === departemenetCode,
		).length;
		return {
			...feature,
			properties: {
				...feature.properties,
				nbAides: nbAides,
			},
		};
	});

	const colorScale = scaleQuantile().domain([0, 10]).range(schemeGreens[5]);

	let showMap = false;
</script>

<details bind:open={showMap}>
	<summary style="cursor: pointer;">Voir la carte des départements</summary>
	{#if showMap}
		<div style="height: 500px; width: 100%; margin-top: 1em;" transition:slide={{ duration: 300 }}>
			<Map {geojson} {enrichGeojson} {colorScale} />
		</div>
	{/if}
</details>
