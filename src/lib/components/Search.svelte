<script lang="ts">
	// TODO: supporter la recherche par région ou département
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { navigating } from '$app/state';
	import AutoComplete from '$lib/components/Autocomplete.svelte';
	import { getSimulation } from '$lib/simulation/context.svelte';
	import type { Localisation } from '$lib/simulation/situation';

	type Variant = 'home' | 'header' | 'panel';

	interface Props {
		variant?: Variant;
		class?: string;
	}

	let { variant = 'panel', class: className = '' }: Props = $props();

	const simulation = getSimulation();

	async function loadItems(keyword: string): Promise<Localisation[]> {
		const url = `/api/collectivites?search=${encodeURIComponent(keyword)}`;
		const response = await fetch(url);
		return (await response.json()) as Localisation[];
	}
</script>

<div
	class={[
		'w-full',
		variant === 'panel'
			? 'mx-auto max-w-screen-md rounded border border-[#86efac] bg-gradient-to-r from-[#dcfce7] to-[#bbf7d0] px-4 py-6 sm:flex sm:items-center sm:gap-6 sm:px-6 sm:py-8'
			: '',
		variant === 'header' ? 'relative z-50 md:ml-auto md:max-w-[360px]' : '',
		variant === 'home' ? '' : '',
		variant === 'home' || variant === 'header' ? 'mav-search-transition' : '',
		className,
	]}
>
	{#if variant === 'panel'}
		<label for="localisation-input" class="mb-3 block text-lg font-medium text-[#14532d] sm:mb-0">
			Localisation
		</label>
	{:else}
		<label for="localisation-input" class="sr-only">Localisation</label>
	{/if}

	<div
		class={[
			`mav-search-box mav-search-box--${variant}`,
			'relative flex min-w-0 flex-row items-center gap-3 transition-[border-color,border-radius,background-color,box-shadow] duration-150 ease-out',
			variant === 'home'
				? 'min-h-[56px] rounded-[28px] border border-[#d8e5df] bg-white px-5 shadow-sm ring-1 ring-[#edf4f1] focus-within:border-[#86efac] focus-within:ring-2 focus-within:ring-[#dcfce7]'
				: variant === 'header'
					? 'min-h-10 rounded-[22px] border border-[#d8e5df] bg-white px-3 shadow-sm focus-within:border-[#a8dec7] focus-within:ring-2 focus-within:ring-[#e5f7ee]'
					: 'min-h-14 flex-1 rounded-3xl bg-white px-4 shadow-sm ring-1 ring-[#d4ded9] focus-within:ring-2 focus-within:ring-[#16a34a]/35',
		]}
	>
		<label for="localisation-input" class="relative z-30 shrink-0">
			<svg
				focusable="false"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class={variant === 'home'
					? 'h-[22px] fill-[#16a34a]'
					: variant === 'header'
						? 'h-[18px] fill-[#647085]'
						: 'h-5 fill-[#647085]'}
				aria-hidden="true"
			>
				<path
					d="M9.5 16a6.5 6.5 0 1 1 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5h-.79l-.28-.27A6.47 6.47 0 0 1 9.5 16Zm0-2a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
				/>
			</svg>
		</label>
		<AutoComplete
			class="w-full"
			label={(item) => `${item.codePostal} - ${item.nom}`}
			placeholder="Commune ou Code postal"
			search={loadItems}
			id="localisation-input"
			selected={simulation.selectedLocalisation}
			mobileFullscreen
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
		{#if simulation.selectedLocalisation}
			<button
				aria-label="Effacer la localisation"
				class={[
					'absolute top-1/2 z-30 flex -translate-y-1/2 items-center justify-center rounded-full font-light text-[#647085] hover:bg-[#edf4f1] hover:text-[#263754]',
					variant === 'header' ? 'right-2 h-7 w-7 text-xl' : 'right-3 h-8 w-8 text-2xl',
				]}
				onclick={() => {
					simulation.clearRememberedLocalisation();
					goto('/', { noScroll: true });
				}}>×</button
			>
		{/if}
	</div>
</div>

<style>
	:global(.mav-search-box--home) {
		--mav-autocomplete-list-top: calc(100% + 0.5rem - 2px);
		--mav-autocomplete-list-left: calc(-3.5rem + 1px);
		--mav-autocomplete-list-right: calc(-1.25rem - 1px);
		--mav-autocomplete-list-border-top-width: 0;
		--mav-autocomplete-list-radius: 0 0 28px 28px;
		--mav-autocomplete-list-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
	}

	:global(.mav-search-box--home:has(.autocomplete-list)) {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
		border-color: #dfe6ef;
		background: white;
		box-shadow: none;
	}

	:global(.mav-search-box--header) {
		--mav-autocomplete-list-top: calc(100% + 1px);
		--mav-autocomplete-list-left: calc(-2.625rem - 1px);
		--mav-autocomplete-list-right: calc(-0.75rem - 1px);
		--mav-autocomplete-list-border-top-width: 0;
		--mav-autocomplete-list-radius: 0 0 22px 22px;
		--mav-autocomplete-list-shadow:
			0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
	}

	:global(.mav-search-box--header:has(.autocomplete-list)) {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
		border-color: #dfe6ef;
		background: white;
		box-shadow: none;
	}

	:global(.mav-search-box--header .autocomplete-input) {
		height: 2.4rem;
		padding-right: 2rem;
		font-size: 0.95rem;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(.mav-search-box--home),
		:global(.mav-search-box--header) {
			--mav-autocomplete-list-animation: mav-autocomplete-home-open 140ms
				cubic-bezier(0.22, 1, 0.36, 1) both;
		}
	}

	@keyframes -global-mav-autocomplete-home-open {
		from {
			opacity: 0;
			transform: scaleY(0.97);
		}

		to {
			opacity: 1;
			transform: scaleY(1);
		}
	}
</style>
