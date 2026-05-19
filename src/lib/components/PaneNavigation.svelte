<script lang="ts">
	import { navigating } from '$app/state';
	import { fly } from 'svelte/transition';

	interface Props {
		depth: any;
		duration?: number;
		children?: import('svelte').Snippet;
	}

	let { depth, duration = 400, children }: Props = $props();

	let navigationDuration = $derived(navigating.type === 'popstate' ? 0 : duration);

	const transitionX = (paneDepth: number) => (paneDepth > 0 ? 700 : -700);
</script>

<div class="grid overflow-hidden -m-3 p-3">
	{#key depth}
		{@const paneDepth = Number(depth)}
		<div
			class="col-start-1 col-end-1 row-start-1 row-end-1"
			in:fly={{ x: transitionX(paneDepth), duration: navigationDuration }}
			out:fly={{ x: transitionX(paneDepth), duration: navigationDuration }}
		>
			{@render children?.()}
		</div>
	{/key}
</div>
