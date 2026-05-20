<script module lang="ts">
	type Variant = 'icon' | 'illustration';

	const iconByCategory: Record<string, string> = {
		'mécanique simple': 'mecanique-simple',
		électrique: 'electrique',
		cargo: 'cargo',
		'cargo électrique': 'cargo-electrique',
		pliant: 'pliant',
		'pliant électrique': 'pliant-electrique',
		motorisation: 'motorisation',
		adapté: 'adapte',
		'forfait-mobilites-durables': 'forfait-mobilites-durables',
	};

	export function bikeCategoryImageSlug(category: string | null | undefined) {
		return category ? iconByCategory[category] : undefined;
	}

	export function bikeCategoryImagePath(
		category: string | null | undefined,
		_variant: Variant = 'icon',
	) {
		const fileName = bikeCategoryImageSlug(category);
		return fileName ? `/images/bike-icons/${fileName}.svg` : undefined;
	}

	export function bikeCategoryIconPath(category: string | null | undefined) {
		return bikeCategoryImagePath(category, 'icon');
	}
</script>

<script lang="ts">
	import { asset } from '$app/paths';

	interface Props {
		category?: string | null;
		variant?: 'icon' | 'illustration';
		className?: string;
		alt?: string;
		transitionKey?: string;
	}

	let {
		category = undefined,
		variant = 'icon',
		className = 'h-12 w-16',
		alt = '',
		transitionKey = undefined,
	}: Props = $props();
	let src = $derived(bikeCategoryImagePath(category, variant));
</script>

{#if src}
	<img
		{alt}
		aria-hidden={!alt}
		class={'inline-block shrink-0 object-contain ' +
			className +
			(transitionKey ? ' mav-bike-icon-transition' : '')}
		decoding="async"
		loading="lazy"
		style={transitionKey ? `--mav-bike-icon-transition: mav-bike-icon-${transitionKey}` : ''}
		src={asset(src)}
	/>
{/if}
