<script>
	import { geoMercator } from 'd3-geo';
	import { Chart, Svg, GeoPath, Legend, Tooltip } from 'layerchart';

	export let geojson;
	export let enrichGeojson;
	export let colorScale;
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
