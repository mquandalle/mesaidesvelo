<script lang="ts">
	import { resolve } from '$app/paths';
	import { getBikeKind } from '$lib/textUtils';

	interface Props {
		aide: {
			titre: string;
			slug: string;
			lien: unknown;
			description?: string;
			maximumsPerVeloKind: Array<[string, string] | unknown[]>;
		};
	}

	let { aide }: Props = $props();
	let lien = $derived(typeof aide.lien === 'string' ? aide.lien : undefined);
</script>

<div class="border-b border-[#e8edf3] py-4">
	<div class="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-5">
		<div class="min-w-0 space-y-1">
			<a
				href={resolve('/ville/[slug]', { slug: aide.slug })}
				class="text-lg font-bold !text-[#263754] !no-underline hover:!text-[#16a34a]"
				>{aide.titre}</a
			>
			{#if aide.description}
				<p class="m-0 text-sm leading-6 text-[#647085]">
					{aide.description.length > 90 ? aide.description.slice(0, 90) + '...' : aide.description}
				</p>
			{/if}
		</div>
		{#if lien}
			<a
				href={lien}
				target="_blank"
				rel="nofollow"
				title="Site officiel de {aide.titre}"
				aria-label="Site officiel de {aide.titre}"
				class="inline-flex h-8 w-8 items-center justify-center rounded-full !text-[#8a96a8] !no-underline hover:bg-[#f5f8f6] hover:!text-[#16a34a]"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M15 3h6v6" />
					<path d="M10 14 21 3" />
					<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
				</svg>
			</a>
		{/if}
	</div>
	<div class="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#647085]">
		{#if aide.maximumsPerVeloKind.length === 0}
			<span>Le calcul de l'aide maximale est soumis à des conditions spécifiques.</span>
		{/if}
		{#each aide.maximumsPerVeloKind as [kind, maximumAide] (kind)}
			<div class="inline-flex items-baseline gap-1.5">
				<span>{kind}</span>
				<a
					href={resolve('/ville/[slug]', { slug: aide.slug }) +
						'?velo=' +
						encodeURIComponent(getBikeKind(kind))}
					rel="nofollow"
					class="font-bold !text-[#263754] !no-underline hover:!text-[#16a34a]">{maximumAide}</a
				>
			</div>
		{/each}
	</div>
</div>
