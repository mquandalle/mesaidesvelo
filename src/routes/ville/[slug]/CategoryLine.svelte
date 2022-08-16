<script>
	import { goto } from '$app/navigation';

	export let montant;
	export let href;

	function clickLine() {
		goto(href, { noscroll: true });
	}
</script>

{#if montant !== 0}
	<tr
		on:click={clickLine}
		class="flex gap-x-2 px-2 sm:(gap-x-4 px-4) items-center justify-between py-2 hover:bg-green-50 cursor-pointer border-b last:border-b-0 group"
	>
		<td class="p-0 "><slot /></td>
		<td class="p-0 flex-1 flex flex-col items-end gap-x-2">
			<span class="text-xs text-gray-500">jusqu’à</span>
			<span class="font-semibold text-right text-xl whitespace-nowrap">{montant}</span>
		</td>
		<td class="p-0 fill-gray-300 group-hover:fill-green-600">
			<a {href} title="Voir les détails" sveltekit:noscroll>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 " viewBox="0 0 290 492"
					><path
						d="m192.4 245.9-184 184a26.7 26.7 0 0 0 0 38l16 16.2c5.1 5.1 11.9 7.9 19.1 7.9 7.2 0 14-2.8 19-7.9L281.7 265c5-5 7.8-11.9 7.8-19 0-7.3-2.7-14.1-7.8-19.2l-219-219c-5-5-11.8-7.8-19-7.8-7.2 0-14 2.8-19 7.9l-16.2 16a27 27 0 0 0 0 38.1L192.4 246Z"
					/></svg
				></a
			>
		</td>
	</tr>
{:else}
	<tr
		{href}
		sveltekit:noscroll
		class="flex gap-x-2 px-2 sm:(gap-x-4 px-4) items-center justify-between py-2 bg-gray-50 border-b last:border-b-0 group "
	>
		<td class="line-through text-gray-600"><slot /></td>
		<td class="flex-1 flex flex-col items-end gap-x-2 text-right">
			<span class="text-sm text-gray-500">aide non <br class="sm:hidden" />disponible</span>
		</td>
	</tr>
{/if}
