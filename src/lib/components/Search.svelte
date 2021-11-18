<script>
	// TODO: supporter la recherche par région ou département
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { localisation } from '$lib/stores/localisation';
	import AutoComplete from 'simple-svelte-autocomplete';
	import { onMount } from 'svelte';

	async function loadItems(keyword) {
		const url = `/api/collectivites?search=${encodeURIComponent(keyword)}`;
		const response = await fetch(url);
		return await response.json();
	}

	function autoSelectInput() {
		const inputElement = document.getElementById('localisation-input');
		inputElement.select();
	}

	// Super HACKY but the <AutoComplete /> runs its `onChange` on load, even if the user
	// hasn't type anything yet. We do this to avoid an unwanted redirection.
	let loaded = false;
	onMount(() => setTimeout(() => (loaded = true), 50));
</script>

<div
	class="bg-green-100 py-8 px-4 sm:px-6 mt-6 flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-center rounded"
>
	<label for="localisation-input">Localisation :</label>
	<div class="flex-1 flex flex-row items-center bg-white shadow rounded-3xl px-3 pt-1">
		<svg
			focusable="false"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			class="h-5 fill-gray-500"
			><path
				d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
			/></svg
		>
		<form class="flex-1" autocomplete="off" on:submit|preventDefault>
			<AutoComplete
				className="w-full"
				labelFunction={({ codePostal, nom }) => codePostal + ' - ' + nom}
				placeholder="Commune ou Code postal"
				searchFunction={loadItems}
				localFiltering={false}
				hideArrow={true}
				showClear={!!$localisation}
				inputId="localisation-input"
				bind:selectedItem={$localisation}
				onFocus={autoSelectInput}
				onChange={(val) => {
					if (typeof window !== 'undefined' && loaded) {
						if (val) {
							goto(`/ville/${val.slug}`, { noscroll: true });
						} else {
							goto('/', { noscroll: true });
						}
					}
				}}
			>
				<div slot="loading">Chargement...</div>
				<div slot="no-results">Pas de résultats</div></AutoComplete
			>
		</form>
	</div>
</div>

<style>
	:global(.autocomplete-list-item.selected) {
		background-color: #047857 !important;
	}

	:global(.autocomplete-list-item.confirmed) {
		background-color: #10b981 !important;
	}

	:global(#localisation-input) {
		outline: transparent;
		height: 34px;
	}
</style>
