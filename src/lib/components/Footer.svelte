<script>
	let showFeedbackform = false;
	let showThankyou = false;

	function submitFeedback(evt) {
		evt.preventDefault();
		const message = document.getElementById('feedback-message').value;
		if (message) {
			fetch('/api/post-feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ message })
			});
			showThankyou = true;
			setTimeout(() => {
				showThankyou = false;
				showFeedbackform = false;
			}, 5000);
		}
	}
</script>

<footer
	class="flex flex-col items-start gap-y-6 pb-6 justify-between sm:flex-row sm:items-end text-xs "
>
	{#if showFeedbackform}
		{#if showThankyou}
			<span class="text-md">Merci pour votre retour ! 😍</span>
		{:else}
			<form class="flex flex-col items-start gap-y-3" on:submit={submitFeedback}>
				<label for="feedback-message">Votre message :</label>
				<!-- svelte-ignore a11y-autofocus -->
				<textarea
					class="border border-green-300 p-3 w-70 h-30 rounded"
					autofocus
					id="feedback-message"
				/>
				<div class="flex gap-x-4">
					<button class="bg-green-600 text-white px-4 py-2 rounded">ENVOYER</button>
					<button class="text-gray-500" on:click={() => (showFeedbackform = false)}>FERMER</button>
				</div>
			</form>
		{/if}
	{:else}
		<button
			on:click={() => (showFeedbackform = true)}
			class="text-green-700 border border-green-400 px-4 py-2 rounded hover:bg-green-100"
		>
			Une erreur ? Un oubli ? Contactez-nous !
		</button>
	{/if}
	<ul class="flex gap-x-4 text-gray-600">
		<li>
			<a href="/a-propos" class="hover:underline hover:text-green-600">À propos</a>
		</li>
		<li>
			<a
				href="https://github.com/mquandalle/mesaidesvelo"
				target="_blank"
				class="hover:underline hover:text-green-600">Code Source</a
			>
		</li>
		<li>
			<a
				href="https://plausible.io/mesaidesvelo.fr"
				target="_blank"
				class="hover:underline hover:text-green-600">Statistiques d’utilisation</a
			>
		</li>
	</ul>
</footer>
