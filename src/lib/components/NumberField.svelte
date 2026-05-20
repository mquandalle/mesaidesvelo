<script lang="ts">
	interface Props {
		value?: number | null;
		unité?: string;
		id: string;
	}

	let { value = $bindable(), unité, id }: Props = $props();
</script>

<div
	class="mt-2 inline-flex items-center rounded-full border border-[#d4ded9] bg-white px-4 py-2 shadow-sm focus-within:border-[#16a34a] focus-within:ring-3 focus-within:ring-[#16a34a]/12"
>
	<input
		data-testid={`${id}-value-${value}`}
		type="number"
		class="m-0 w-30 bg-transparent text-right text-[#172338] outline-none"
		{id}
		oninput={(e) => {
			const target = e.currentTarget;
			// Delayed the update to wait the user to finish typing
			setTimeout(() => {
				value = target.value === '' ? null : Number(target.value);
			}, 500);
		}}
		{value}
	/>
	<label for={id}><span class="ml-2 text-[#647085]">{unité || ''}</span></label>
</div>

<style>
	input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
