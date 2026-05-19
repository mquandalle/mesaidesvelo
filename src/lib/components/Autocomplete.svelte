<script lang="ts" generics="Item">
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
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
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	const listId = id
		? `${id}-suggestions`
		: `autocomplete-${Math.random().toString(36).slice(2)}-suggestions`;

	let input = $state<HTMLInputElement>();
	let list = $state<HTMLDivElement>();
	let container = $state<HTMLDivElement>();
	let remoteSuggestions = $state<Item[]>([]);
	let pendingSearch = $state('');
	let resolvedSearch = $state('');
	let opened = $state(false);
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
	let showList = $derived(opened && (loading || suggestions.length > 0 || showNoResults));
	let activeDescendant = $derived(
		showList && highlightedIndex >= 0 && highlightedIndex < suggestions.length
			? `${listId}-${highlightedIndex}`
			: undefined,
	);

	function getLabel(item: Item | null | undefined) {
		return item == null ? '' : label(item);
	}

	function cleanSearch(value: string) {
		return value
			.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, ' ')
			.trim()
			.toLowerCase();
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
			requestSuggestions(query);
		} else {
			clearSuggestions();
			close();
		}
	}

	function handleFocus(event: FocusEvent & { currentTarget: HTMLInputElement }) {
		event.currentTarget.select();
		opened = true;

		if (hasQuery) {
			requestSuggestions(cleanText);
		}
	}

	function handleBlur(event: FocusEvent) {
		if (!isInsideContainer(event.relatedTarget)) {
			close();
		}
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
				if (opened) {
					event.preventDefault();
					close();
				}
				break;

			case 'Tab':
				close();
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
			close();
		}
	}

	function isInsideContainer(target: EventTarget | null) {
		return target instanceof Node && Boolean(container?.contains(target));
	}

	function selectItem(item: Item) {
		text = getLabel(item);
		clearSuggestions();
		close();
		input?.blur();
		onselect(item);
	}

	function close() {
		opened = false;
	}
</script>

<div bind:this={container} class="relative min-w-0 {className}">
	<input
		bind:this={input}
		type="text"
		{id}
		bind:value={() => text, setText}
		{placeholder}
		autocomplete="off"
		disabled={!browser}
		class="autocomplete-input relative z-20 h-9 w-full bg-transparent py-0 pr-10 pl-2 text-base outline-none placeholder:text-gray-500 disabled:cursor-wait"
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
			bind:this={list}
			id={listId}
			class="autocomplete-list absolute top-[calc(100%-0.875rem)] right-[-0.75rem] left-[-2rem] z-10 max-h-80 overflow-y-auto rounded-b-3xl bg-white px-7 pt-[0.875rem] pb-3 shadow-md"
			role="listbox"
		>
			{#if suggestions.length > 0}
				{#each suggestions as suggestion, index}
					<button
						type="button"
						id={`${listId}-${index}`}
						data-autocomplete-index={index}
						class="autocomplete-list-item block w-full py-2 text-left leading-tight text-gray-800 hover:bg-green-100 {index ===
						highlightedIndex
							? 'bg-green-100'
							: ''}"
						role="option"
						aria-selected={index === highlightedIndex}
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
				<div class="py-2 leading-tight text-gray-500">Chargement...</div>
			{:else}
				<div class="py-2 leading-tight text-gray-500">Pas de résultats</div>
			{/if}
		</div>
	{/if}
</div>

<svelte:window onpointerdown={handleWindowPointerDown} />
