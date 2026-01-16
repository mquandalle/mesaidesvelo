<script>
	import geojson from '$lib/data/regions.json';
	import aidesCollectivites from '$lib/data/aides-collectivities.json';
	import { scaleQuantile } from 'd3-scale';
	import { schemeGreens } from 'd3-scale-chromatic';
	import { geoMercator } from 'd3-geo';
	import { Chart, Svg, GeoPath, Legend, Tooltip } from 'layerchart';

	const enrichGeojson = geojson.features.map((feature) => {
		const regionCode = feature.properties.code;
		const nbAides = Object.entries(aidesCollectivites).filter(
			([_, aide]) => aide.collectivity.kind === 'région' && aide.collectivity.value === regionCode,
		).length;

		return {
			...feature,
			properties: {
				...feature.properties,
				nbAides: nbAides,
			},
		};
	});

	const colorScale = scaleQuantile()
		.domain([0, Math.max(...enrichGeojson.map((d) => d.properties.nbAides))])
		.range(schemeGreens[3]);
</script>

<div class="h-[600px] overflow-hidden">
	<Chart
		geo={{
			projection: geoMercator,
			fitGeojson: geojson,
		}}
		padding={{ bottom: 100 }}
		tooltip={{ raiseTarget: true }}
		let:tooltip
	>
		<Svg>
			<g>
				{#each enrichGeojson as feature}
					<GeoPath
						geojson={feature}
						fill={colorScale(feature.properties.nbAides)}
						class="stroke-none hover:stroke-black/50"
						{tooltip}
					/>
				{/each}
			</g>
			<GeoPath {geojson} class="fill-none stroke-black/30 pointer-events-none" />
		</Svg>
		<Legend title="Nombre d'aides" scale={colorScale} />

		<Tooltip.Root
			let:data
			class="bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-700"
		>
			<Tooltip.Header>
				{data.properties.nom}
			</Tooltip.Header>
			<Tooltip.List>
				<Tooltip.Item
					label="Nombre d'aides"
					value={data.properties.nbAides}
					format="integer"
					valueAlign="right"
				/>
			</Tooltip.List>
		</Tooltip.Root>
	</Chart>
</div>
