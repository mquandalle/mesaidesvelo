<script>
	import Emoji from '$lib/components/Emoji.svelte';
	import publicodesRules from '../aides.yaml';

	const supportedAides = Object.entries(publicodesRules)
		.filter(([name, rule]) => name.startsWith('aides .') && rule.titre)
		.map(([, aide]) => aide);
</script>

<div class="prose mt-8 w-full max-w-screen-md m-auto">
	<h1>Les aides intégrées sur le site</h1>
	<p>
		Intégrer des aides est un travail manuel. Contactez-nous si vous constatez une erreur ou un
		oubli !
	</p>

	<ul>
		{#each supportedAides as { titre, lien }}
			<li>
				{titre} <a href={lien} target="_blank"><Emoji emoji="ℹ" className="!mt-0 !mb-0" /></a>
			</li>
		{/each}
	</ul>
</div>
