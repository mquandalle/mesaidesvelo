<script>
	export let value;
	export let unité;
	export let id;
</script>

<div class="border rounded p-2 mt-1 bg-white shadow-sm">
	<input
		data-testid={`${id}-value-${value}`}
		type="number"
		class="m-0 text-right w-35 focus:outline-transparent"
		{id}
		on:input={(e) => {
			// Delayed the update to wait the user to finish typing
			setTimeout(() => {
				value = e.target.value === '' ? null : Number(e.target.value);
			}, 500);
		}}
		{value}
	/>
	<label for={id}><span class="text-gray-600">{unité || ''}</span></label>
</div>

<style>
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
