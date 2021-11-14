<script>
	// TODO: supporter la recherche par région ou département
	import { goto } from '$app/navigation';
	import { localisation } from '$lib/stores/localisation';
	import AutoComplete from 'simple-svelte-autocomplete';
	import { onMount } from 'svelte';

	async function loadItems(keyword) {
		const url = `/api/collectivites?search=${encodeURIComponent(keyword)}`;
		const response = await fetch(url);
		return await response.json();
	}

	let defaultItems = [];

	onMount(async () => {
		const response = await fetch('/api/collectivites');
		defaultItems = await response.json();
	});
</script>

<div
	class="bg-green-100 p-6 mt-6 flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-center rounded-md"
>
	<label for="localisation">Localisation :</label>
	<AutoComplete
		className="flex-1"
		labelFunction={({ codePostal, nom }) => codePostal + ' - ' + nom}
		placeholder="Commune ou Code postal"
		searchFunction={loadItems}
		localFiltering={false}
		hideArrow={true}
		items={defaultItems}
		showClear={!!$localisation}
		inputId="localisation"
		bind:selectedItem={$localisation}
		onChange={() => typeof window !== 'undefined' && goto('/', { noscroll: true })}
	/>
</div>

<style>
	:global(.autocomplete-list-item.selected) {
		background-color: #047857 !important;
	}

	:global(.autocomplete-list-item.confirmed) {
		background-color: #10b981 !important;
	}
</style>
