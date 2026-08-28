<script>
	import PlayerCard from '$lib/components/PlayerCard.svelte';

	let { data } = $props();
</script>

<article class="dc-player-list">
	{#each data.players as player (player.id)}
		<PlayerCard {player} />
	{/each}
</article>

<style>
	.dc-player-list {
		max-width: 640px;
		margin: auto;
	}
</style>
