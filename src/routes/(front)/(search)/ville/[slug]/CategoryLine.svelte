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
			class="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-lg border border-[#dfe6ef] bg-white px-3 pt-4 pb-4 transition hover:-translate-y-0.5 hover:border-[#8ee0ad] hover:bg-[#f7fdf9] hover:shadow-md"
		>
			{#if iconCategory}
				<div class="flex min-h-[104px] items-end justify-center">
					<BikeCategoryIcon
						category={iconCategory}
						className="h-[104px] w-full max-w-[190px]"
						{transitionKey}
					/>
				</div>
			{/if}
			<h3
				class="mav-bike-title-transition mt-3 text-center text-sm leading-snug font-semibold text-[#10233a]"
				style={transitionKey ? `--mav-bike-title-transition: mav-bike-title-${transitionKey}` : ''}
			>
				{@render children?.()}
			</h3>
			<p class="mt-auto pt-2 text-center leading-tight">
				<span class="block text-[0.7rem] font-medium tracking-wide text-[#647085] uppercase"
					>Jusqu'à</span
				>
				<strong class="text-xl font-extrabold text-[#047857]">
					<AnimatedAmount amount={activeAmount} unit={montant.unit} />
				</strong>
			</p>
		</article>
	</a>
{:else}
	<article
		role="listitem"
		class="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f8faf9] px-3 pt-4 pb-4 text-[#647085]"
	>
		{#if iconCategory}
			<div class="flex min-h-[104px] items-end justify-center">
				<BikeCategoryIcon
					category={iconCategory}
					className="h-[104px] w-full max-w-[190px] opacity-35 saturate-0"
				/>
			</div>
		{/if}
		<h3 class="mt-3 text-center text-sm leading-snug font-semibold text-[#647085] line-through">
			{@render children?.()}
		</h3>
		<p
			class="mt-auto pt-2 text-center text-xs font-medium tracking-wide text-[#94a1b5] uppercase"
		>
			Aide non disponible
		</p>
	</article>
{/if}
