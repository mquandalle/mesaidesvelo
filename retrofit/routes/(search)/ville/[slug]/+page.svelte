<script>
	import Results from './Results.svelte';

	export let data;
</script>

<svelte:head>
	<title>Les aides pour le retrofit de votre voiture à {data.ville.nom}</title>
</svelte:head>

<Results />

<div class="prose my-12">
	<h1>Aide Rétrofit à {data.ville.nom}</h1>
	{#if data.ville.zfe}
		<h2>{data.ville.nom} est une zone à faibles émissions mobilité (ZFE)</h2>
		<img
			src="/images/panneau-zfe.webp"
			alt="Signalisation d'une zone ZFE avec les vignettes Crit'Air"
			class="float-left pt-3 mr-6 !mb-6 max-h-[160px] w-[100px] object-contain"
		/>
		<p>
			Instaurée dans le cadre de la loi Climat d'août 2021, la mise en place des Zones à faibles
			émissions mobilité est obligatoire avant le 31 décembre 2024 pour toutes les agglomérations de
			plus de 150 000 habitants. Mais les villes qui le souhaitent peuvent mettre en place le mesure
			avant, ce qui est le cas à {data.ville.nom}.
		</p>
		<p>
			Dans les ZFE les véhicules les plus polluants identifiés par les vignettes Crit'Air 5, 4 et 3
			sont soumis à des restrictions de circulation. Ces restrictions peuvent s'appliquer sur des
			plages horaires déterminées. Les collectivités territoriales sont libres de fixer des règles
			plus strictes.
		</p>
	{/if}
</div>
