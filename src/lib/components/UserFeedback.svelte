<script>
	import { page } from '$app/state';
	import { getContext } from 'svelte';

	let feedbackState = $state('closed');
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
			body: JSON.stringify({ message, page: page.url.pathname, embedSource }),
		});

		if (!serverResponse.ok) {
			feedbackState = 'error';
		} else {
			feedbackState = 'sent';
			setTimeout(() => {
				feedbackState = 'closed';
			}, 20000);
		}
	}
</script>

{#if feedbackState === 'closed'}
	<button
		onclick={() => (feedbackState = 'open')}
		class="text-green-600 border border-green-600 rounded-full px-4 py-2 rounded whitespace-nowrap hover:bg-green-600 hover:text-white"
	>
		Une erreur ? Un oubli ? Contactez-nous !
	</button>
{:else if feedbackState === 'open'}
	<form class="flex flex-col items-start gap-y-2" onsubmit={submitFeedback}>
		<label for="feedback-message">Votre message :</label>
		<!-- svelte-ignore a11y_autofocus -->
		<textarea
			class="border border-green-600 p-3 w-[65ch] h-30 rounded"
			autofocus
			id="feedback-message"
		></textarea>
		<div class="flex gap-x-4 uppercase">
			<button type="submit" class="bg-green-600 text-white px-4 py-2 rounded"> Envoyer </button>
			<button type="button" class="text-gray-500" onclick={() => (feedbackState = 'closed')}>
				Fermer
			</button>
		</div>
	</form>
{:else if feedbackState === 'sent'}
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
{:else if feedbackState === 'error'}
	<div>
		<p class="text-xl">Une erreur s'est produite ☹</p>
		<p class="text-xs mt-2">
			Votre message n'a pas pû être envoyé.
			<br />
			Vous pouvez nous envoyer un email à emile@calinou.coop.
		</p>
	</div>
{/if}
