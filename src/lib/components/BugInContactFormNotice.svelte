<script>
	import { onMount } from 'svelte';

	let open = false;

	let showNotice = false;
	onMount(() => {
		showNotice = localStorage.noticeBugContactFormSeen !== 'true';
	});
	function openNotice() {
		open = true;
		localStorage.noticeBugContactFormSeen = true;
	}
</script>

{#if showNotice}
	<p class="w-full max-w-screen-md mx-auto text-xs bg-yellow-100 p-2 text-yellow-900">
		⚠ Nous n'avons peut-être pas reçu votre message

		{#if !open}
			<span on:click={openNotice} class="underline hover:text-yellow-600 cursor-pointer"
				>En savoir plus</span
			>
		{:else}
			<br /><br />
			Le formulaire de contact ci-dessous était cassé du 1<sup>er</sup> février au 15 juillet 2022. Malheureusement
			si vous nous avez envoyé un message pendant cette période nous ne l'avons pas reçu. Nous sommes
			désolé de la gêne occasionnée et avons mis en place les correctifs pour que ce problème ne se reproduise
			plus.
		{/if}
	</p>
{/if}
