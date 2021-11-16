<script>
	import UserFeedback from './UserFeedback.svelte';
</script>

<footer
	class="flex flex-col items-start gap-y-6 pb-6 justify-between sm:flex-row sm:items-end text-xs "
>
	<UserFeedback />
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
