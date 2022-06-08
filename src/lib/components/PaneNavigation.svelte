<script>
	import { fly } from 'svelte/transition';

	export let depth;
	export let duration = 400;

	let currentDepth = 0;
	let showTransition = false;
	let transitionX;

	$: if (typeof window !== 'undefined') {
		showTransition = currentDepth !== depth;
		transitionX = currentDepth > depth ? 700 : -700;
		currentDepth = depth;
	}
</script>

<div class="grid overflow-hidden -m-3 p-3">
	{#key depth}
		<div
			class="col-start-1 col-end-1 row-start-1 row-end-1"
			in:fly={{ x: -transitionX, duration: showTransition ? duration : 0 }}
			out:fly|local={{ x: transitionX, duration }}
		>
			<slot />
		</div>
	{/key}
</div>
