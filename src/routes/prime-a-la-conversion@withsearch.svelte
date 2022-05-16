<script>
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';
	import DetailsLine from '$lib/components/DetailsLine.svelte';

	import Questions from '$lib/components/Questions.svelte';

	const ruleName = 'aides . prime à la conversion';
</script>

<div class="w-full max-w-screen-md m-auto">
	<div class="mt-8" />
	<BackButtonAides />

	<div class="border mt-6 rounded-md shadow-sm">
		<DetailsLine {ruleName} />
	</div>

	<Questions goals={[ruleName]} />
</div>
