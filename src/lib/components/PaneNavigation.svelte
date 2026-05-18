<script lang="ts">
	import { fly } from 'svelte/transition';

	interface Props {
		depth: any;
		duration?: number;
		children?: import('svelte').Snippet;
	}

	let { depth, duration = 400, children }: Props = $props();

	const transitionX = (paneDepth: number) => (paneDepth > 0 ? 700 : -700);
</script>

<div class="grid overflow-hidden -m-3 p-3">
	{#key depth}
		{@const paneDepth = Number(depth)}
		<div
			class="col-start-1 col-end-1 row-start-1 row-end-1"
			in:fly={{ x: transitionX(paneDepth), duration }}
			out:fly={{ x: transitionX(paneDepth), duration }}
		>
			{@render children?.()}
		</div>
	{/key}
</div>
