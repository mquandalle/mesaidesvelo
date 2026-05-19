<script lang="ts">
	// TODO: supporter la recherche par région ou département
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { localisation } from '$lib/stores';
	import AutoComplete from '$lib/components/Autocomplete.svelte';
	import { navigating } from '$app/state';

	type Localisation = {
		nom: string;
		slug: string;
		codePostal: string;
	};

	async function loadItems(keyword: string): Promise<Localisation[]> {
		const url = `/api/collectivites?search=${encodeURIComponent(keyword)}`;
		const response = await fetch(url);
		return (await response.json()) as Localisation[];
	}
</script>

<div
	class="w-full max-w-screen-md mx-auto mt-10 bg-gradient-to-r from-green-100 to-green-200 py-6 sm:py-8 px-4 sm:px-6 mt-6 flex flex-col gap-x-4 gap-y-2 sm:flex-row sm:items-center rounded border border-green-300"
>
	<label for="localisation-input" class="sm:text-lg text-green-900">Localisation</label>
	<div class="relative flex-1 flex flex-row items-center bg-white shadow rounded-3xl px-3 pt-1">
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
			class="w-full"
			label={(item) => `${item.codePostal} - ${item.nom}`}
			placeholder="Commune ou Code postal"
			search={loadItems}
			id="localisation-input"
			selected={$localisation}
			onselect={(val) => {
				if (!navigating.to) {
					goto(resolve('/ville/[slug]', { slug: val.slug }), { noScroll: true });
				}
			}}
		>
			{#snippet item({ item })}
				<div>
					<span class="tabular-nums">{item.codePostal}</span> - {item.nom}
				</div>
			{/snippet}
		</AutoComplete>
		{#if $localisation}
			<button
				aria-label="Effacer la localisation"
				class="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-3xl font-light cursor-pointer text-gray-500 hover:text-gray-800"
				onclick={() => localisation.set(null)}>&times;</button
			>
		{/if}
	</div>
</div>
