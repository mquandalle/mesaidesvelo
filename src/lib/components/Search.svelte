<script>
	// TODO: supporter la recherche par région ou département
	import { goto } from '$app/navigation';
	import { localisation } from '$lib/stores';
	import AutoComplete from '$lib/components/Autocomplete.svelte';
	import { navigating } from '$app/stores';

	async function loadItems(keyword) {
		const url = `/api/collectivites?search=${encodeURIComponent(keyword)}`;
		const response = await fetch(url);
		return await response.json();
	}

	function autoSelectInput() {
		const inputElement = document.getElementById('localisation-input');
		inputElement.select();
	}
</script>

<div
	class="w-full max-w-screen-md m-auto bg-dark-900 py-8 px-4 sm:px-6 mt-6 flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-center rounded"
>
	<label for="localisation-input" class="text-neutral-50">Localisation :</label>
	<div class="flex-1 flex flex-row items-center bg-white shadow rounded-3xl px-3 pt-1">
		<label for="localisation-input" class="relative z-99"
			><svg
				focusable="false"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="h-5 fill-gray-500"
				><path
					d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
				/></svg
			></label
		>
		<AutoComplete
			className="w-full"
			labelFunction={(item) => {
				if (item === null || item === undefined) {
					return '';
				}
				return `${item.codePostal} - ${item.nom}`;
			}}
			placeholder="Commune ou Code postal"
			searchFunction={loadItems}
			localFiltering={false}
			hideArrow={true}
			inputId="localisation-input"
			selectedItem={$localisation}
			onFocus={autoSelectInput}
			onChange={(val) => {
				const derivedPath = val ? `/ville/${val.slug}` : `/`;
				if (!$navigating) {
					goto(derivedPath, { noScroll: true });
				}
			}}
		>
			<div slot="item" let:item>
				<span class="tabular-nums">{item.codePostal}</span> - {item.nom}
			</div>
			<div slot="loading">Chargement...</div>
			<div slot="no-results">Pas de résultats</div></AutoComplete
		>
		{#if $localisation}
			<span
				class="text-3xl font-light cursor-pointer text-gray-500 hover:text-gray-800 relative z-99 -ml-[15px]"
				on:click={() => localisation.set(null)}>&times;</span
			>
		{/if}
	</div>
</div>
