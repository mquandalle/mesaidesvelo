<script lang="ts">
	import Search from './Search.svelte';

	const biggestCities = ['Paris', 'Lyon', 'Toulouse', 'Nantes', 'Montpellier', 'Strasbourg'];
</script>

<main
	class="mx-auto flex min-h-[calc(100vh-220px)] w-full max-w-screen-md flex-col items-center px-4 pt-[10vh] pb-14"
>
	<a class="mb-7 inline-flex no-underline" href="/" aria-label="MesAidesVélo">
		<img class="mav-logo-transition h-[68px] w-auto" src="/images/logo.svg" alt="" />
	</a>

	<h1
		class="m-0 max-w-[680px] text-center text-[1.65rem] leading-[1.1] font-[780] text-[#10233a] sm:text-[2.85rem] sm:leading-[1.04]"
	>
		Trouvez toutes les aides vélo disponibles chez vous
	</h1>

	<div class="mt-8 w-full max-w-[680px]">
		<Search variant="home" />
	</div>

	<div
		class="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-[#647085]"
		aria-label="Suggestions de villes"
	>
		<span>Essayez avec</span>
		{#each biggestCities as city}
			<a
				href="/ville/{city.toLowerCase()}"
				class="rounded-full border border-[#dbe7e2] bg-[#fbfefd] px-3 py-1.5 font-semibold text-[#2c3c57] no-underline shadow-[0_5px_14px_rgb(23_35_56_/_0.06)] hover:border-[#a8dec7] hover:bg-[#f7fbf9]"
			>
				{city}
			</a>
		{/each}
	</div>
</main>
