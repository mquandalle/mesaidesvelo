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

<a href={resolve('/ville/[slug]', { slug: aide.slug })} class="hover:text-green-700"
	>{aide.titre}
</a>
{#if aide.description}
	- {aide.description.length > 50 ? aide.description.slice(0, 50) + '...' : aide.description}{/if}
{#if lien}
	<a
		href={lien}
		target="_blank"
		rel="nofollow"
		title="Site officiel"
		class="text-xs inline-block ml-2 !font-normal !no-underline border px-1 rounded bg-gray-50 hover:bg-green-100"
		>site officiel</a
	>
{/if}<br />
<div class="inline-block text-xs text-gray-600">
	{#if aide.maximumsPerVeloKind.length === 0}
		Le calcul de l'aide maximale est soumis à des conditions spécifiques.
	{/if}
	{#each aide.maximumsPerVeloKind as [kind, maximumAide] (kind)}
		<div class="inline-block border-r border-gray-300 mr-2 pr-2 last:mr-0 last:border-r-0">
			{kind}
			<a
				href={resolve('/ville/[slug]', { slug: aide.slug }) +
					'?velo=' +
					encodeURIComponent(getBikeKind(kind))}
				rel="nofollow"
				class="inline-block pl-1 !no-underline !text-gray-700 hover:!text-green-600"
				>{maximumAide}</a
			>
		</div>
	{/each}
</div>
