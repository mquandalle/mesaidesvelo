<script lang="ts">
	interface Props {
		className?: string;
		children?: import('svelte').Snippet;
	}

	let { className = '', children }: Props = $props();
</script>

<span
	class="text-xs text-green-800 bg-green-50 border border-green-100 inline-block px-3 py-1 rounded font-normal {className}"
	>{@render children?.()}</span
>
