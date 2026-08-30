<script>
	import PlayerList from '$lib/components/PlayerList.svelte';

	let { data } = $props();
</script>

<article class="player-list">
	<PlayerList players={data.players} class="player-list-inner" />
</article>

<style>
	.player-list {
		max-width: 1080px;
		margin: auto;
		font-size: 1.2rem;
		overflow-y: scroll;
		height: 100%;
	}

	:global(.player-list-inner) {
		width: 100%;
	}
</style>
