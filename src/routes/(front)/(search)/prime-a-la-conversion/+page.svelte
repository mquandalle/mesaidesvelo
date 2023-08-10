<script>
	import BackButtonAides from '$lib/components/BackButtonAides.svelte';
	import DetailsLine from '$lib/components/DetailsLine.svelte';
	import Questions from '$lib/components/Questions.svelte';
	import { engine } from '$lib/engine';
	import { publicodeSituation, veloCat } from '$lib/stores';

	$: engine.setSituation($publicodeSituation);
	veloCat.set('électrique');
</script>

<div class="w-full max-w-screen-md m-auto">
	<div class="mt-8" />
	<BackButtonAides />

	<div class="border mt-6 rounded-md shadow-sm">
		<DetailsLine ruleName="aides . prime à la conversion" />
		<DetailsLine ruleName="aides . prime à la conversion . surprime ZFE" />
	</div>

	<Questions goals={['aides . prime à la conversion']} />
</div>
