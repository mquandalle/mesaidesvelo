<script>
	import { formatValue } from 'publicodes';

	export let amount;
	export let unit;
	let prevAmount;
	let difference;

	const format = (x, { withPlusSign = false } = {}) => {
		const sign = withPlusSign && x > 0 ? '+' : x < 0 ? '-' : '';
		const formatedValue = formatValue({ nodeValue: Math.abs(x), unit }, { precision: 0 });
		return `${sign}\u00A0${formatedValue}`.trim();
	};

	$: if (typeof window !== 'undefined') {
		const activeElement = document.activeElement;
		const ignoreInput = activeElement.tagName === 'INPUT' && activeElement.type === 'number';
		if (!ignoreInput && prevAmount !== undefined) {
			difference = amount - prevAmount;
		}
		prevAmount = amount;
	}

	$: color = difference > 0 ? 'text-green-400' : 'text-red-500';
</script>

<span class="relative w-[min-content]">
	{#if difference}
		{#key difference}
			<span
				class="evaporate block absolute -top-5 right-0 font-semibold pointer-events-none {color}"
				>{format(difference, { withPlusSign: true })}</span
			>
		{/key}
	{/if}
	{format(amount)}
</span>

<style>
	.evaporate {
		font-size: 80%;
		opacity: 0;
		animation: evaporate 1.5s ease-out;
		transform: scaleY(0.1);
	}

	@keyframes evaporate {
		5% {
			opacity: 1;
			transform: scaleY(1);
		}
		70% {
			opacity: 1;
		}
		to {
			transform: translateY(-15px);
			opacity: 0;
		}
	}
</style>
