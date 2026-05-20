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
		class="whitespace-nowrap rounded-full border border-[#cfe2da] bg-white px-4 py-2 font-semibold text-[#16a34a] shadow-sm hover:border-[#16a34a] hover:bg-[#f0fdf4]"
	>
		Une erreur ? Un oubli ? Contactez-nous !
	</button>
{:else if feedbackState === 'open'}
	<form class="flex flex-col items-start gap-y-2" onsubmit={submitFeedback}>
		<label for="feedback-message" class="font-semibold text-[#263754]">Votre message :</label>
		<!-- svelte-ignore a11y_autofocus -->
		<textarea
			class="h-30 w-[min(65ch,calc(100vw-2rem))] rounded-lg border border-[#d4ded9] bg-white p-3 outline-none focus:border-[#16a34a] focus:ring-3 focus:ring-[#16a34a]/12"
			autofocus
			id="feedback-message"
		></textarea>
		<div class="flex gap-x-4">
			<button type="submit" class="rounded-full bg-[#16a34a] px-4 py-2 font-bold text-white">
				Envoyer
			</button>
			<button
				type="button"
				class="font-semibold text-[#647085]"
				onclick={() => (feedbackState = 'closed')}
			>
				Fermer
			</button>
		</div>
	</form>
{:else if feedbackState === 'sent'}
	<div>
		<p class="text-xl">Merci pour votre retour ! 😍</p>
		<p class="text-xs mt-2">
			→ Vous pouvez suivre les demandes sur <a
				class="text-[#16a34a] underline"
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
