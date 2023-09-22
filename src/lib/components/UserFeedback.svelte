<script>
	import { page } from '$app/stores';
	import { getContext } from 'svelte';

	let state = 'closed';
	const { embedSource } = getContext('embed');

	async function submitFeedback(evt) {
		evt.preventDefault();
		const message = document.getElementById('feedback-message').value;
		if (!message) {
			return;
		}
		window?.plausible?.('contact');
		const serverResponse = await fetch('/api/post-feedback', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message, page: $page.url.pathname, embedSource }),
		});

		if (!serverResponse.ok) {
			state = 'error';
		} else {
			state = 'sent';
			setTimeout(() => {
				state = 'closed';
			}, 20000);
		}
	}
</script>

{#if state === 'closed'}
	<button
		on:click={() => (state = 'open')}
		class="text-s4-green border border-s4-green px-4 py-2 rounded whitespace-nowrap hover:(bg-s4-green text-white)"
	>
		Une erreur ? Un oubli ? Contactez-nous !
	</button>
{:else if state === 'open'}
	<form class="flex flex-col items-start gap-y-2" on:submit={submitFeedback}>
		<label for="feedback-message">Votre message :</label>
		<!-- svelte-ignore a11y-autofocus -->
		<textarea
			class="border border-green-300 p-3 w-70 h-30 rounded"
			autofocus
			id="feedback-message"
		/>
		<div class="flex gap-x-4 uppercase">
			<button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Envoyer</button>
			<button class="text-gray-500" on:click={() => (state = 'closed')}>Fermer</button>
		</div>
	</form>
{:else if state === 'sent'}
	<div>
		<p class="text-xl">Merci pour votre retour ! 😍</p>
		<p class="text-xs mt-2">
			→ Vous pouvez suivre les demandes sur <a
				class="text-green-700 underline"
				href="https://github.com/mquandalle/mesaidesvelo/issues"
				target="_blank">Github</a
			>.
		</p>
	</div>
{:else if state === 'error'}
	<div>
		<p class="text-xl">Une erreur s'est produite ☹</p>
		<p class="text-xs mt-2">
			Votre message n'a pas pû être envoyé.
			<br />
			Vous pouvez nous envoyer un email à maxime@mesaidesvelo.fr
		</p>
	</div>
{/if}
