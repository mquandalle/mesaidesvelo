<script lang="ts">
	interface Props {
		className?: string;
		children?: import('svelte').Snippet;
	}

	let { className = '', children }: Props = $props();
</script>

<span
	class="inline-block rounded-full border border-[#cfe2da] bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#15803d] {className}"
	>{@render children?.()}</span
>
