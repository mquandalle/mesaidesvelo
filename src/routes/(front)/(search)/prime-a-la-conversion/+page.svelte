<script>
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';
</script>

<div class="w-full max-w-screen-md m-auto">
	<div class="mt-8" />
	<BackButtonAides />

	<div class="border mt-6 rounded-md shadow-sm">
		<!-- {#if aides.length === 0} -->
		<p class="p-4 italic text-gray-600">
			La prime à la conversion pour un vélo à assistance électrique (VAE) est
			<strong>supprimée depuis le 14 février 2025</strong>.
		</p>
		<p class="p-4 text-green-600 hover:underline">
			<a
				href="https://www.service-public.fr/particuliers/vosdroits/F36827"
				target="_blank"
				class="hover:underline"
			>
				→ En savoir plus
			</a>
		</p>
	</div>
</div>
