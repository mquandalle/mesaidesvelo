<script>
	export let group;
	export let value;

	$: isSelected = group === value;
</script>

<label
	class="border rounded px-4 py-2 shadow-sm flex items-center gap-x-2 cursor-pointer {isSelected
		? 'bg-green-500 border-green-600 text-white'
		: 'bg-white text-gray-700 hover:bg-green-100 hover:border-green-200 hover:text-gray-800'}"
>
	<input type="radio" bind:group {value} />
	<span class="text-current"><slot /></span>
</label>

<style>
	input[type='radio'] {
		--form-control-color: #059669;
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
