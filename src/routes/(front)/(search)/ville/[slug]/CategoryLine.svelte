<script>
	import AnimatedAmount from '$lib/components/AnimatedAmount.svelte';

	export let montant;
	export let href;
	export let relNoFollow = false;
	export let isFirst = false;
	export let isLast = false;
</script>

{#if montant.nodeValue !== 0}
	<a tabindex="0" data-sveltekit-noscroll {href} rel={relNoFollow ? 'nofollow' : null}>
		<div
			role="row"
			class={'flex gap-x-2 px-2 sm:(gap-x-4 px-4) items-center justify-between py-2 bg-white hover:bg-green-100 cursor-pointer group' +
				' ' +
				(isFirst ? 'rounded-t' : '') +
				' ' +
				(isLast ? 'rounded-b' : 'border-b')}
		>
			<div role="cell"><slot /></div>
			<div role="cell" class="flex-1 flex flex-col items-end gap-x-2">
				<span class="text-xs text-gray-500">jusqu’à</span>
				<span class="font-semibold text-right text-xl whitespace-nowrap"
					><AnimatedAmount amount={montant.nodeValue} unit={montant.unit} /></span
				>
			</div>
			<div class="fill-gray-300 group-hover:fill-green-600">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6" viewBox="0 0 290 492"
					><path
						d="m192.4 245.9-184 184a26.7 26.7 0 0 0 0 38l16 16.2c5.1 5.1 11.9 7.9 19.1 7.9 7.2 0 14-2.8 19-7.9L281.7 265c5-5 7.8-11.9 7.8-19 0-7.3-2.7-14.1-7.8-19.2l-219-219c-5-5-11.8-7.8-19-7.8-7.2 0-14 2.8-19 7.9l-16.2 16a27 27 0 0 0 0 38.1L192.4 246Z"
					/></svg
				>
			</div>
		</div>
	</a>
{:else}
	<div
		role="row"
		class={'flex gap-x-2 px-2 sm:(gap-x-4 px-4) items-center justify-between py-2 bg-gray-50  group' +
			' ' +
			(isFirst ? 'rounded-t' : '') +
			' ' +
			(isLast ? 'rounded-b' : 'border-b')}
	>
		<div role="cell" class="line-through text-gray-600"><slot /></div>
		<div role="cell" class="flex-1 flex flex-col items-end gap-x-2 text-right">
			<span class="text-sm text-gray-500">aide non <br class="sm:hidden" />disponible</span>
		</div>
	</div>
{/if}
