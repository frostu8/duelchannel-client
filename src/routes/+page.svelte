<script>
	import PlayerList from '$lib/components/PlayerList.svelte';

	let { data } = $props();
</script>

<article class="player-list">
	<PlayerList players={data.players} class="player-list-inner"/>
</article>

<style>
	.player-list {
		max-width: 640px;
		margin: auto;
	}

	:global(.player-list-inner) {
		width: 100%;
	}
</style>
