<script>
	import { formatValue } from 'publicodes';

	export let className = '';
	export let amount;
	export let unit;

	let prevAmount;
	let difference;

	const format = (x, { withPlusSign = false } = {}) => {
		const sign = withPlusSign && x > 0 ? '+' : x < 0 ? '-' : '';
		const formatedValue = formatValue({ nodeValue: Math.abs(x), unit }, { precision: 0 });
		console.log('formatedValue', formatedValue);
		return `${sign}${formatedValue}`.trim();
	};

	$: if (typeof window !== 'undefined') {
		const activeElement = document.activeElement;
		const ignoreInput = activeElement.tagName === 'INPUT' && activeElement.type === 'number';
		if (!ignoreInput && prevAmount !== undefined) {
			difference = amount - prevAmount;
		}
		prevAmount = amount;
	}

	$: color = difference > 0 ? 'text-green-500' : 'text-red-500';
	$: bgColor = difference > 0 ? 'bg-green-50' : 'bg-red-50';
</script>

<span class={`relative w-[min-content] ${className}`}>
	{#if difference}
		{#key difference}
			<span
				class="evaporate block absolute -top-5 right-0 font-semibold rounded px-2 pointer-events-none {color} {bgColor}"
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
