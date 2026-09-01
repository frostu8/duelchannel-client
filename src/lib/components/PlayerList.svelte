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

	let tableClass = () => [className].flat().concat(['player-list']);
</script>

<table class={tableClass()}>
	<thead>
		<tr>
			<th scope="row"></th>
			<th scope="row" title="Amount of duels won over duels played">Record</th>
			<th scope="row" colspan="2" title="Duel Rating (0-25000, higher is better) and rank letter"
				>DR</th
			>
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
		/* Pin header to top */
		position: sticky;
		top: 0;
		z-index: 10;

		background-color: var(--bg-base);
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
