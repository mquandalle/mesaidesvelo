<script lang="ts">
	import { formatValue } from 'publicodes';
	import type { Unit } from 'publicodes';

	interface Props {
		className?: string;
		amount: number;
		unit?: Unit;
	}

	let { className = '', amount, unit }: Props = $props();

	let prevAmount: number | undefined;
	let difference = $state<number | undefined>();

	const format = (x: number, { withPlusSign = false } = {}) => {
		const sign = withPlusSign && x > 0 ? '+' : x < 0 ? '-' : '';
		const formatedValue = formatValue(
			{ nodeValue: Math.abs(x), unit },
			{
				precision: 0,
			},
		);
		return `${sign}${formatedValue}`.trim();
	};

	$effect(() => {
		const activeElement = document.activeElement;
		const ignoreInput =
			activeElement instanceof HTMLInputElement && activeElement.type === 'number';
		if (!ignoreInput && prevAmount !== undefined) {
			difference = amount - prevAmount;
		}
		prevAmount = amount;
	});

	let color = $derived(difference > 0 ? 'text-green-500' : 'text-red-500');
	let bgColor = $derived(difference > 0 ? 'bg-green-50' : 'bg-red-50');
</script>

<span class={`relative w-[min-content] text-green-700 ${className}`}>
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
