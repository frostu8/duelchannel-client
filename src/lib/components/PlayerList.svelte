<script>
	import PlayerListEntry from './PlayerListEntry.svelte';

	/**
   * @typedef {Object} Props
   * @property {import('$lib/client/players').Player[]} players
   * The list of players to render.
   * @property {string | string[]} class
   */

  /** @type {Props} */
  let { players, class: className } = $props();

  let tableClass = () => [className].flat().concat(["player-list"]);
</script>

<table class={tableClass()}>
  <thead>
    <tr>
      <th scope="row"></th>
      <th scope="row">Record</th>
      <th scope="row">DR</th>
    </tr>
  </thead>
  <tbody>
    {#each players as player (player.id)}
      <PlayerListEntry {player} />
    {/each}
  </tbody>
</table>

<style>
  .player-list {
    border-collapse: collapse;
  }

  .player-list > thead th {
    color: var(--text-secondary);
    padding: 12px;
    font-weight: normal;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
      color: var(--text-primary);
      font-weight: bold;
    }
  }
</style>
