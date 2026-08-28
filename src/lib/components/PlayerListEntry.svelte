<script>
	//import Counter from './counter/Counter.svelte';
	import MiniBadgeDisplay from './MiniBadgeDisplay.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {import('$lib/client/players').Player} player
	 * The player to render.
	 */

	/** @type {Props} */
	let { player } = $props();

	let drDisplay = () => player.dr != null ? Math.floor(player.dr).toLocaleString() : null;
	let drDisplaySub = () => player.dr != null
		? "." + ((player.dr - Math.trunc(player.dr)) * 100).toFixed(0).padStart(2, '0')
		: null;

	let wins = () => Math.floor(player.matchesPlayed * player.winRatio).toLocaleString();
	let total = () => player.matchesPlayed.toLocaleString();
	let winPercentage = () => (player.winRatio * 100).toFixed(2) + "%";
</script>

<tr class="player-card">
	<th scope="col">
		<div class="header">
			<a class="user-href" href="/player/{player.id}">
				{player.displayName}
			</a>
			<MiniBadgeDisplay --height="1rem" flags={player.flags} />
		</div>
	</th>
	<td class="record">
		<span>{wins()}</span><span class="muted">/{total()} ({winPercentage()})</span>
	</td>
	<td class="rating-ordinal">
		{#if drDisplay() != null}
			<span>{drDisplay()}</span>
			<sub>{drDisplaySub()}</sub>
		{:else}
			<span class="unrated">Unrated</span>
		{/if}
	</td>
</tr>

<style>
	.user-href {
		color: var(--text-secondary);
		text-decoration: none;

		&:hover {
			color: white;
		}
	}

	.player-card {
		color: var(--text-primary);
		background-color: var(--bg-primary);

		&:nth-child(even) {
			background-color: var(--bg-secondary);
		}
	}

	.player-card > th,
	.player-card > td {
		text-align: center;
		padding: 0.75em;

		&:first-child {
			text-align: left;
		}

		&:last-child {
			text-align: right;
		}
	}

	.rating-ordinal {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: right;
		font-weight: bold;

		span {
			text-transform: uppercase;
		}

		sub {
			color: var(--text-secondary);
		}
	}

	.record {
		color: var(--text-secondary);
	}

	.muted,
	.unrated {
		color: var(--text-muted);
	}

	.unrated {
		font-style: italic;
	}

	.header {
		display: flex;
		flex-flow: row wrap;
		font-size: 1rem;
		/*align-items: center;*/
		text-transform: uppercase;
		gap: 6px;
	}
</style>
