<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import PlayerCard from '$lib/components/PlayerCard.svelte';

  let { data } = $props();
</script>

<div class="dc-app-container">
  <NavigationBar />
  <main class="dc-main">
    <section class="player-list">
      {#each data.players as player}
        <PlayerCard {player} />
      {/each}
    </section>
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

  .player-list {
    max-width: 640px;
    margin: auto;
  }
</style>
