<script lang="ts">
	import AnimatedAmount from '$lib/components/AnimatedAmount.svelte';
	import BikeCategoryIcon, { bikeCategoryImageSlug } from '$lib/components/BikeCategoryIcon.svelte';
	import type { Unit } from 'publicodes';
	import type { Snippet } from 'svelte';

	interface Props {
		montant: {
			nodeValue: number | null;
			unit?: Unit;
		};
		href: string;
		relNoFollow?: boolean;
		iconCategory?: string | null;
		children?: Snippet;
	}

	let { montant, href, relNoFollow = false, iconCategory = undefined, children }: Props = $props();

	let activeAmount = $derived(
		typeof montant.nodeValue === 'number' && montant.nodeValue !== 0
			? montant.nodeValue
			: undefined,
	);
	let transitionKey = $derived(bikeCategoryImageSlug(iconCategory));

	const ticketViewBoxWidth = 90;
	const ticketViewBoxHeight = 40;
	const ticketCornerRadius = 7;
	const ticketNotchRadius = 6.4;
	const ticketNotchStartY = ticketViewBoxHeight / 2 - ticketNotchRadius;
	const ticketNotchEndY = ticketViewBoxHeight / 2 + ticketNotchRadius;

	const ticketPath = `
		M ${ticketCornerRadius} 0
		L ${ticketViewBoxWidth - ticketCornerRadius} 0
		A ${ticketCornerRadius} ${ticketCornerRadius} 0 0 1 ${ticketViewBoxWidth} ${ticketCornerRadius}
		L ${ticketViewBoxWidth} ${ticketNotchStartY}
		A ${ticketNotchRadius} ${ticketNotchRadius} 0 0 0 ${ticketViewBoxWidth} ${ticketNotchEndY}
		L ${ticketViewBoxWidth} ${ticketViewBoxHeight - ticketCornerRadius}
		A ${ticketCornerRadius} ${ticketCornerRadius} 0 0 1 ${ticketViewBoxWidth - ticketCornerRadius} ${ticketViewBoxHeight}
		L ${ticketCornerRadius} ${ticketViewBoxHeight}
		A ${ticketCornerRadius} ${ticketCornerRadius} 0 0 1 0 ${ticketViewBoxHeight - ticketCornerRadius}
		L 0 ${ticketNotchEndY}
		A ${ticketNotchRadius} ${ticketNotchRadius} 0 0 0 0 ${ticketNotchStartY}
		L 0 ${ticketCornerRadius}
		A ${ticketCornerRadius} ${ticketCornerRadius} 0 0 1 ${ticketCornerRadius} 0
		Z
	`;
</script>

{#if activeAmount !== undefined}
	<a
		tabindex="0"
		{href}
		rel={relNoFollow ? 'nofollow' : null}
		class="group block h-full text-[#172338] no-underline"
	>
		<article
			role="listitem"
			class="relative flex h-full min-h-[188px] flex-col overflow-hidden rounded-lg border border-[#dfe6ef] bg-white px-3 pt-5 pb-4 transition hover:-translate-y-0.5 hover:border-[#8ee0ad] hover:bg-[#f7fdf9] hover:shadow-md"
		>
			<div class="amount-tag" aria-label="Montant maximal de l’aide">
				<svg
					viewBox="0 0 {ticketViewBoxWidth} {ticketViewBoxHeight}"
					class="amount-tag__shape"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d={ticketPath} />
				</svg>
				<div class="amount-tag__body">
					<span>aide max.</span>
					<strong><AnimatedAmount amount={activeAmount} unit={montant.unit} /></strong>
				</div>
			</div>
			{#if iconCategory}
				<div class="flex min-h-[104px] items-end justify-center pt-3">
					<BikeCategoryIcon
						category={iconCategory}
						className="h-[104px] w-full max-w-[190px]"
						{transitionKey}
					/>
				</div>
			{/if}
			<h3
				class="mav-bike-title-transition mt-3 text-center text-base leading-snug font-bold text-[#10233a]"
				style={transitionKey ? `--mav-bike-title-transition: mav-bike-title-${transitionKey}` : ''}
			>
				{@render children?.()}
			</h3>
		</article>
	</a>
{:else}
	<article
		role="listitem"
		class="relative flex h-full min-h-[188px] flex-col overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f8faf9] px-3 pt-5 pb-4 text-[#647085]"
	>
		<div class="amount-tag amount-tag--muted" aria-label="Aide non disponible">
			<svg
				viewBox="0 0 {ticketViewBoxWidth} {ticketViewBoxHeight}"
				class="amount-tag__shape"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d={ticketPath} />
			</svg>
			<div class="amount-tag__body">
				<span>aide non</span>
				<strong>disponible</strong>
			</div>
		</div>
		{#if iconCategory}
			<div class="flex min-h-[104px] items-end justify-center pt-3">
				<BikeCategoryIcon
					category={iconCategory}
					className="h-[104px] w-full max-w-[190px] opacity-35 saturate-0"
				/>
			</div>
		{/if}
		<h3 class="mt-3 text-center text-base leading-snug font-bold text-[#647085] line-through">
			{@render children?.()}
		</h3>
	</article>
{/if}

<style>
	.amount-tag {
		--tag-bg: #f0fdf4;
		--tag-border: #86efac;
		--tag-color: #047857;

		position: absolute;
		top: 0.75rem;
		right: 0.7rem;
		z-index: 1;
		display: grid;
		width: 5.6rem;
		height: 2.25rem;
		place-items: center;
		filter: drop-shadow(0 3px 7px rgb(15 35 58 / 0.06));
	}

	.amount-tag__shape {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		fill: var(--tag-bg);
		stroke: var(--tag-border);
		stroke-width: 1.5;
		vector-effect: non-scaling-stroke;
	}

	.amount-tag__body {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0.08rem 0.5rem 0;
		color: var(--tag-color);
		line-height: 1;
	}

	.amount-tag__body span {
		font-size: 0.46rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0;
	}

	.amount-tag__body strong {
		margin-top: 0.07rem;
		font-size: 0.85rem;
		font-weight: 900;
		white-space: nowrap;
	}

	.amount-tag--muted {
		--tag-bg: #f8fafc;
		--tag-border: #dbe2ea;
		--tag-color: #647085;
	}
</style>
