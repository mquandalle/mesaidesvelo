<script lang="ts" generics="Item">
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		search: (query: string) => Item[] | Promise<Item[]>;
		label: (item: Item) => string;
		placeholder?: string;
		class?: string;
		id?: string;
		selected?: Item | null;
		onselect: (item: Item) => void;
		item?: Snippet<[{ item: Item }]>;
		mobileFullscreen?: boolean;
	};

	let {
		search,
		label,
		placeholder,
		class: className = '',
		id,
		selected,
		onselect,
		item: itemSnippet,
		mobileFullscreen = false,
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	const listId = id
		? `${id}-suggestions`
		: `autocomplete-${Math.random().toString(36).slice(2)}-suggestions`;
	const mobileInputId = `${listId}-input`;
	const mobileListId = `${listId}-mobile`;

	let input = $state<HTMLInputElement>();
	let mobileInput = $state<HTMLInputElement>();
	let desktopList = $state<HTMLDivElement>();
	let mobileList = $state<HTMLDivElement>();
	let container = $state<HTMLDivElement>();
	let remoteSuggestions = $state<Item[]>([]);
	let pendingSearch = $state('');
	let resolvedSearch = $state('');
	let opened = $state(false);
	let mobileSearchOpen = $state(false);
	let mobileViewportHeight = $state('100dvh');
	let mobileViewportOffsetTop = $state('0px');
	let highlightedIndex = $state(-1);
	let lastRequestId = 0;

	let text: string = $derived(getLabel(selected));
	let cleanText = $derived(cleanSearch(text));
	let hasQuery = $derived(cleanText.length > 0);
	let loading = $derived(pendingSearch.length > 0 && pendingSearch === cleanText);
	let suggestions: Item[] = $derived(remoteSuggestions);
	let suggestionsAreFresh = $derived(resolvedSearch === cleanText);
	let showNoResults = $derived(
		hasQuery && !loading && suggestionsAreFresh && suggestions.length === 0,
	);
	let showList = $derived(
		opened && !mobileSearchOpen && (loading || suggestions.length > 0 || showNoResults),
	);
	let showMobileList = $derived(
		mobileSearchOpen && (loading || suggestions.length > 0 || showNoResults),
	);
	let activeListId = $derived(mobileSearchOpen ? mobileListId : listId);
	let list = $derived(mobileSearchOpen ? mobileList : desktopList);
	let activeDescendant = $derived(
		(showList || showMobileList) && highlightedIndex >= 0 && highlightedIndex < suggestions.length
			? `${activeListId}-${highlightedIndex}`
			: undefined,
	);

	onMount(() => {
		updateMobileViewport();

		const viewport = window.visualViewport;
		window.addEventListener('resize', updateMobileViewport);
		viewport?.addEventListener('resize', updateMobileViewport);
		viewport?.addEventListener('scroll', updateMobileViewport);

		return () => {
			window.removeEventListener('resize', updateMobileViewport);
			viewport?.removeEventListener('resize', updateMobileViewport);
			viewport?.removeEventListener('scroll', updateMobileViewport);
		};
	});

	function getLabel(item: Item | null | undefined) {
		return item == null ? '' : label(item);
	}

	function cleanSearch(value: string) {
		return value
			.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ' ')
			.trim()
			.toLowerCase();
	}

	function shouldUseMobileSearch() {
		return mobileFullscreen && browser && window.matchMedia('(max-width: 767px)').matches;
	}

	function updateMobileViewport() {
		if (!browser || !mobileFullscreen) {
			return;
		}

		const viewport = window.visualViewport;
		mobileViewportHeight = `${viewport?.height ?? window.innerHeight}px`;
		mobileViewportOffsetTop = `${viewport?.offsetTop ?? 0}px`;

		if (mobileSearchOpen && !shouldUseMobileSearch()) {
			closeMobileSearch();
		}
	}

	function isSelectedText(value: string) {
		return selected != null && cleanSearch(value) === cleanSearch(getLabel(selected));
	}

	function clearSuggestions() {
		lastRequestId += 1;
		pendingSearch = '';
		resolvedSearch = '';
		remoteSuggestions = [];
		highlightedIndex = -1;
	}

	async function requestSuggestions(query: string) {
		const requestId = ++lastRequestId;

		if (!query) {
			clearSuggestions();
			return;
		}

		pendingSearch = query;
		opened = true;

		try {
			const results = await search(query);

			if (requestId !== lastRequestId) {
				return;
			}

			remoteSuggestions = Array.isArray(results) ? results : [];
			resolvedSearch = query;
			await setHighlightedIndex(remoteSuggestions.length > 0 ? 0 : -1);
		} catch {
			if (requestId !== lastRequestId) {
				return;
			}

			remoteSuggestions = [];
			resolvedSearch = query;
			await setHighlightedIndex(-1);
		} finally {
			if (requestId === lastRequestId) {
				pendingSearch = '';
			}
		}
	}

	function setText(value: string) {
		text = value;

		const query = cleanSearch(value);

		if (query) {
			if (isSelectedText(value)) {
				clearSuggestions();
				close();
				return;
			}

			requestSuggestions(query);
		} else {
			clearSuggestions();
			close();
		}
	}

	async function openMobileSearch() {
		mobileSearchOpen = true;
		opened = true;
		updateMobileViewport();
		await tick();
		mobileInput?.focus({ preventScroll: true });
		mobileInput?.select();
	}

	function closeMobileSearch({ restoreSelected = true } = {}) {
		if (restoreSelected) {
			text = getLabel(selected);
		}
		clearSuggestions();
		mobileSearchOpen = false;
		opened = false;
		mobileInput?.blur();
		input?.blur();
	}

	async function clearText() {
		setText('');
		await tick();
		(mobileInput ?? input)?.focus({ preventScroll: true });
	}

	async function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
		event.currentTarget.select();

		if (shouldUseMobileSearch()) {
			if (isSelectedText(event.currentTarget.value)) {
				clearSuggestions();
				await openMobileSearch();
				close();
				return;
			}

			await openMobileSearch();

			if (hasQuery) {
				requestSuggestions(cleanText);
			}

			return;
		}

		if (isSelectedText(event.currentTarget.value)) {
			clearSuggestions();
			close();
			return;
		}

		if (hasQuery) {
			requestSuggestions(cleanText);
		}
	}

	function handleBlur(event: FocusEvent) {
		if (isInsideContainer(event.relatedTarget)) {
			return;
		}

		window.setTimeout(() => {
			if (!isInsideContainer(document.activeElement)) {
				if (mobileSearchOpen) {
					closeMobileSearch();
				} else {
					close();
				}
			}
		}, 120);
	}

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				opened = true;
				if (suggestions.length > 0) {
					setHighlightedIndex((highlightedIndex + 1) % suggestions.length);
				}
				break;

			case 'ArrowUp':
				if (suggestions.length > 0) {
					event.preventDefault();
					setHighlightedIndex((highlightedIndex - 1 + suggestions.length) % suggestions.length);
				}
				break;

			case 'Enter':
				if (opened && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
					event.preventDefault();
					selectItem(suggestions[highlightedIndex]);
				}
				break;

			case 'Escape':
				if (mobileSearchOpen) {
					event.preventDefault();
					closeMobileSearch();
				} else if (opened) {
					event.preventDefault();
					close();
				}
				break;

			case 'Tab':
				if (mobileSearchOpen) {
					closeMobileSearch();
				} else {
					close();
				}
				break;
		}
	}

	async function setHighlightedIndex(index: number) {
		highlightedIndex = index;
		await tick();
		scrollHighlightedItemIntoView();
	}

	function scrollHighlightedItemIntoView() {
		if (!browser || highlightedIndex < 0) {
			return;
		}

		list
			?.querySelector(`[data-autocomplete-index="${highlightedIndex}"]`)
			?.scrollIntoView({ block: 'nearest' });
	}

	function handleWindowPointerDown(event: PointerEvent) {
		if (!isInsideContainer(event.target)) {
			if (mobileSearchOpen) {
				closeMobileSearch();
			} else {
				close();
			}
		}
	}

	function isInsideContainer(target: EventTarget | null) {
		return target instanceof Node && Boolean(container?.contains(target));
	}

	function selectItem(item: Item) {
		text = getLabel(item);
		clearSuggestions();
		close();
		if (mobileSearchOpen) {
			closeMobileSearch({ restoreSelected: false });
		}
		input?.blur();
		onselect(item);
	}

	function close() {
		opened = false;
	}
</script>

{#snippet searchIcon(className: string)}
	<svg class={className} focusable="false" viewBox="0 0 24 24" aria-hidden="true">
		<path
			d="M9.5 16a6.5 6.5 0 1 1 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5h-.79l-.28-.27A6.47 6.47 0 0 1 9.5 16Zm0-2a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
		/>
	</svg>
{/snippet}

<div bind:this={container} class={['relative min-w-0', className]}>
	<input
		bind:this={input}
		type="text"
		{id}
		bind:value={() => text, setText}
		{placeholder}
		autocomplete="off"
		disabled={!browser}
		class="autocomplete-input relative z-20 h-11 w-full bg-transparent py-0 pr-10 pl-0 text-base text-[#172338] outline-none placeholder:text-[#7d8798] disabled:cursor-wait"
		role="combobox"
		aria-autocomplete="list"
		aria-controls={listId}
		aria-expanded={showList}
		aria-activedescendant={activeDescendant}
		onfocus={handleFocus}
		onblur={handleBlur}
		onkeydown={handleKeydown}
	/>

	{#if showList}
		<div
			bind:this={desktopList}
			id={listId}
			class="autocomplete-list z-40 max-h-80 overflow-y-auto border border-[#dfe6ef] bg-white py-2"
			role="listbox"
		>
			{#if suggestions.length > 0}
				{#each suggestions as suggestion, index}
					<button
						type="button"
						id={`${listId}-${index}`}
						data-autocomplete-index={index}
						class="autocomplete-list-item block w-full px-6 py-2.5 text-left leading-tight text-[#263754] hover:bg-[#dcfce7] {index ===
						highlightedIndex
							? 'bg-[#dcfce7]'
							: ''}"
						role="option"
						aria-selected={index === highlightedIndex}
						onmousedown={(event) => event.preventDefault()}
						onclick={() => selectItem(suggestion)}
						onpointerenter={() => (highlightedIndex = index)}
					>
						{#if itemSnippet}
							{@render itemSnippet({ item: suggestion })}
						{:else}
							{getLabel(suggestion)}
						{/if}
					</button>
				{/each}
			{:else if loading}
				<div class="px-6 py-2.5 leading-tight text-[#647085]">Chargement...</div>
			{:else}
				<div class="px-6 py-2.5 leading-tight text-[#647085]">Pas de résultats</div>
			{/if}
		</div>
	{/if}

	{#if mobileFullscreen && mobileSearchOpen}
		<div
			class="fixed inset-x-0 top-0 z-[100] flex flex-col bg-[#f7faf8] shadow-2xl md:hidden"
			style:height={mobileViewportHeight}
			style:transform={`translateY(${mobileViewportOffsetTop})`}
			role="dialog"
			aria-label="Recherche"
		>
			<div
				class="flex items-center gap-2 border-b border-[#dfe6ef] px-3 py-3"
				style:padding-top="max(12px, env(safe-area-inset-top))"
			>
				<button
					type="button"
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#263754] hover:bg-[#edf4f1]"
					aria-label="Fermer la recherche"
					onclick={() => closeMobileSearch()}
				>
					<svg
						class="h-6 w-6 fill-none stroke-current stroke-2"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path d="M15 6 9 12l6 6" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>

				<div
					class="flex min-w-0 flex-1 items-center gap-3 rounded-3xl bg-white px-3 ring-2 ring-[#16a34a]/35"
				>
					{@render searchIcon('h-5 w-5 shrink-0 fill-[#647085]')}
					<input
						bind:this={mobileInput}
						type="text"
						id={mobileInputId}
						bind:value={() => text, setText}
						{placeholder}
						autocomplete="off"
						disabled={!browser}
						class="h-11 min-w-0 flex-1 bg-transparent py-0 pr-1 pl-0 text-[17px] text-[#172338] outline-none placeholder:text-[#7d8798] disabled:cursor-wait"
						role="combobox"
						aria-autocomplete="list"
						aria-controls={mobileListId}
						aria-expanded={showMobileList}
						aria-activedescendant={activeDescendant}
						onfocus={(event) => event.currentTarget.select()}
						onblur={handleBlur}
						onkeydown={handleKeydown}
					/>

					{#if text.length > 0}
						<button
							type="button"
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#647085] hover:bg-[#edf4f1]"
							aria-label="Effacer la recherche"
							onclick={clearText}
						>
							<svg
								class="h-4 w-4 fill-none stroke-current stroke-2.5"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="m7 7 10 10M17 7 7 17" stroke-linecap="round" />
							</svg>
						</button>
					{/if}
				</div>
			</div>

			<div
				class="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
				style:padding-bottom="calc(16px + env(safe-area-inset-bottom))"
			>
				{#if suggestions.length > 0}
					<div bind:this={mobileList} id={mobileListId} class="py-1" role="listbox">
						{#each suggestions as suggestion, index}
							<button
								type="button"
								id={`${mobileListId}-${index}`}
								data-autocomplete-index={index}
								class="block w-full px-6 py-3.5 text-left text-[17px] leading-tight text-[#263754] hover:bg-[#dcfce7] {index ===
								highlightedIndex
									? 'bg-[#dcfce7]'
									: ''}"
								role="option"
								aria-selected={index === highlightedIndex}
								onmousedown={(event) => event.preventDefault()}
								onclick={() => selectItem(suggestion)}
								onpointerenter={() => (highlightedIndex = index)}
							>
								{#if itemSnippet}
									{@render itemSnippet({ item: suggestion })}
								{:else}
									{getLabel(suggestion)}
								{/if}
							</button>
						{/each}
					</div>
				{:else if loading}
					<div
						id={mobileListId}
						class="px-6 py-4 text-[17px] leading-tight text-[#647085]"
						role="listbox"
					>
						Chargement...
					</div>
				{:else if showNoResults}
					<div
						id={mobileListId}
						class="px-6 py-4 text-[17px] leading-tight text-[#647085]"
						role="listbox"
					>
						Pas de résultats
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<svelte:window onpointerdown={handleWindowPointerDown} />

<style>
	.autocomplete-list {
		position: absolute;
		top: var(--mav-autocomplete-list-top, calc(100% + 0.625rem));
		right: var(--mav-autocomplete-list-right, -3.25rem);
		left: var(--mav-autocomplete-list-left, -2.75rem);
		border-top-width: var(--mav-autocomplete-list-border-top-width, 1px);
		border-radius: var(--mav-autocomplete-list-radius, 1.5rem);
		box-shadow: var(
			--mav-autocomplete-list-shadow,
			0 20px 25px -5px rgb(0 0 0 / 0.1),
			0 8px 10px -6px rgb(0 0 0 / 0.1)
		);
		transform-origin: top center;
		animation: var(--mav-autocomplete-list-animation, none);
	}
</style>
