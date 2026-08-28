<script>
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import favicon from '$lib/assets/favicon.png';
	import '../app.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
</svelte:head>

<div class="dc-app-container">
	<NavigationBar />
	<main class="dc-main">
		{@render children()}
	</main>
</div>

<style>
	.dc-app-container {
		display: flex;
		flex-flow: column nowrap;
		height: 100%;
	}

	.dc-main {
		flex-grow: 1;
		width: 100%;
		overflow: scroll;
	}
</style>
