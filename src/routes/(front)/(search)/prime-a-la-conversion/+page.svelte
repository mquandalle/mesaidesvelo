<script lang="ts">
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';
</script>

<div class="mx-auto w-full max-w-screen-md">
	<div class="mt-8"></div>
	<BackButtonAides />

	<div class="mt-6 overflow-hidden rounded-lg border border-[#dfe6ef] bg-white shadow-sm">
		<!-- {#if aides.length === 0} -->
		<p class="p-5 leading-6 text-[#647085]">
			La prime à la conversion pour un vélo à assistance électrique (VAE) est
			<strong>supprimée depuis le 14 février 2025</strong>.
		</p>
		<p class="border-t border-[#edf1ee] p-5 text-sm font-bold text-[#16a34a] hover:underline">
			<a
				href="https://www.service-public.fr/particuliers/vosdroits/F36827"
				target="_blank"
				class="hover:underline"
			>
				En savoir plus →
			</a>
		</p>
	</div>
</div>
