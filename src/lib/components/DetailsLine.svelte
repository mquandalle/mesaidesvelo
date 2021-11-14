<script>
	import Badge from './Badge.svelte';

	export let aide;
</script>

<div class="border-b last:border-b-0 p-4">
	<div class="flex gap-x-4 text-lg flex-wrap">
		<h3 class="font-semibold text-md">
			{aide.title}
		</h3>
		<div class="font-bold text-gray-800 flex-1 text-right sm:order-3">{aide.montant}</div>
		{#if aide.conditionDeRessources}
			<span class="w-full sm:w-auto">
				<Badge className="sm:order-2">Sous condition de ressources</Badge>
			</span>
		{/if}
	</div>
	<p class="text-gray-600 mt-2 text-sm ">
		{aide.notice}
	</p>
	{#if aide.link}
		<p class="mt-2 text-sm text-green-700">
			<a href={aide.link} target="_blank" class="hover:underline">→ En savoir plus</a>
		</p>
	{/if}
</div>
