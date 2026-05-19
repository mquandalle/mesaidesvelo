<script lang="ts">
	import { navigating } from '$app/state';
	import { fly } from 'svelte/transition';

	interface Props {
		depth: number;
		duration?: number;
		children?: import('svelte').Snippet;
	}

	let { depth, duration = 400, children }: Props = $props();

	function normalizeDepth(paneDepth: unknown) {
		return typeof paneDepth === 'number' ? paneDepth : 0;
	}

	function getNavigationDuration() {
		return navigating.type === 'popstate' ? 0 : duration;
	}

	function transitionX(paneDepth: number) {
		return paneDepth > 0 ? 700 : -700;
	}

	function paneFly(node: Element, { duration }: { duration: number }) {
		const paneDepth = Number((node as HTMLElement).dataset.paneDepth ?? 0);

		return fly(node, {
			x: transitionX(paneDepth),
			duration,
		});
	}
</script>

<div class="grid overflow-hidden -m-3 p-3">
	{#key depth}
		<div
			class="col-start-1 col-end-1 row-start-1 row-end-1"
			data-pane-depth={normalizeDepth(depth)}
			in:paneFly={{ duration: getNavigationDuration() }}
			out:paneFly={{ duration: getNavigationDuration() }}
		>
			{@render children?.()}
		</div>
	{/key}
</div>
