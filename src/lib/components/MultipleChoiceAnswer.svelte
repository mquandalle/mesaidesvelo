<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		group?: string | number;
		value: string | number;
		onSelect?: (value: string | number) => void;
		children?: Snippet;
	}

	let { group, value, onSelect = () => {}, children }: Props = $props();

	let isSelected = $derived(group === value);
</script>

<label
	class="flex cursor-pointer items-center gap-x-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm {isSelected
		? 'border-[#16a34a] bg-[#16a34a] text-white'
		: 'border-[#d4ded9] bg-white text-[#263754] hover:border-[#16a34a] hover:bg-[#f0fdf4]'}"
>
	<input type="radio" checked={isSelected} {value} onchange={() => onSelect(value)} />
	<span class="text-current">{@render children?.()}</span>
</label>

<style>
	input[type='radio'] {
		--form-control-color: #16a34a;
		appearance: none;
		background-color: white;
		margin: 0;

		font: inherit;
		color: currentColor;
		width: 1em;
		height: 1em;
		border: 1px solid currentColor;
		border-radius: 50%;
		transform: translateY(-0.075em);

		display: grid;
		place-content: center;
	}

	input[type='radio']::before {
		content: '';
		width: 0.65em;
		height: 0.65em;
		border-radius: 50%;
		transform: scale(0);
		transition: 120ms transform ease-in-out;
		box-shadow: inset 1em 1em var(--form-control-color);
		background-color: CanvasText;
	}

	input[type='radio']:checked::before {
		transform: scale(1);
	}
</style>
