<script>
	import { getBikeKind } from './+page.server';

	export let aide;
</script>

<a href="/ville/{aide.slug}" class="hover:text-green-700">{aide.titre}</a>
<a
	href={aide.lien}
	target="_blank"
	rel="nofollow"
	title="Site officiel"
	class="text-xs inline-block ml-2 !font-normal !no-underline border px-1 rounded bg-gray-50 hover:bg-green-100"
	>site officiel</a
><br />
<div class="inline-block text-xs text-gray-600">
	{#each aide.maximumsPerVeloKind as [kind, maximumAide]}
		<div class="inline-block not-last:border-r border-gray-300 mr-2 pr-2 last:mr-0">
			{kind}
			<a
				href="/ville/{aide.slug}?velo={getBikeKind(kind)}"
				class="inline-block pl-1 !no-underline !text-gray-700 !hover:text-green-600"
				>{maximumAide}</a
			>
		</div>
	{/each}
</div>
