<script>
	import { onMount } from 'svelte';

	let optedOut = false;
	onMount(() => {
		if (localStorage.plausible_ignore === 'true') {
			optedOut = true;
		}
	});
	function optOutTracking(evt) {
		if (evt.target.checked) {
			localStorage.plausible_ignore = true;
		} else {
			localStorage.clear();
		}
	}
</script>

<svelte:head>
	<title>À propos - MesAidesVélo</title>
	<meta
		name="description"
		content="Les infos sur Mesaidesvelo.fr, le site qui vous permet de trouver toutes les aides vélo auxquelles vous avez le droit."
	/>
</svelte:head>

<div class="prose mt-8 w-full max-w-screen-md m-auto">
	<h1>À propos</h1>
	<h2>Qu’est ce que c’est ?</h2>
	<p>
		Cet outil rassemble l’ensemble des aides à l’achat de vélo. Il vous permet d’identifier en
		quelques clics celles auxquelles vous avez droit.
	</p>
	<hr />
	<h2>Mentions Légales</h2>
	<h3>Éditeur</h3>
	<p>Maxime Quandalle</p>
	<h3>Hébergeur</h3>
	<p>
		<a href="https://vercel.com" target="_blank">Vercel Inc.</a><br />
		340 S Lemon Ave #4133<br />
		Walnut, CA 91789
	</p>
	<h3>Cookies</h3>
	<p>Ce site n'utilise pas de Cookies</p>
	<p>Vous pouvez vous exclure du suivi d’audience en cochant la case ci-dessous</p>
	<p>
		<label
			><input type="checkbox" checked={optedOut} on:change={optOutTracking} /> Je ne souhaite pas être
			suivi</label
		>
	</p>
	<p>
		Le suivi d’audience est accessible librement sur <a
			href="https://plausible.io/mesaidesvelo.fr"
			target="_blank">Plausible.io</a
		>.
	</p>
</div>
