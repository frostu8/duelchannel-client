<script>
	//import Counter from './counter/Counter.svelte';
	import MiniBadgeDisplay from './MiniBadgeDisplay.svelte';
	import RankDisplay from './RankDisplay.svelte';

	/**
	 * @typedef {Object} Props
	 * @property {import('$lib/client/players').Player} player
	 * The player to render.
	 */

	/** @type {Props} */
	let { player } = $props();

	let drDisplay = () => (player.dr != null ? Math.floor(player.dr).toLocaleString() : null);
	let drDisplaySub = () =>
		player.dr != null
			? '.' + ((player.dr - Math.trunc(player.dr)) * 100).toFixed(0).padStart(2, '0')
			: null;

	let wins = () => Math.floor(player.matchesPlayed * player.winRatio).toLocaleString();
	let total = () => player.matchesPlayed.toLocaleString();
	let winPercentage = () => (player.winRatio * 100).toFixed(2) + '%';

	let matchesLeft = $derived.by(() =>
		player.matchesUntilRated != null ? 10 - player.matchesUntilRated : null
	);
</script>

<tr class="player-card">
	<th scope="col">
		<div class="header">
			<a class="user-href" href="/player/{player.id}">
				{player.displayName}
			</a>
			<MiniBadgeDisplay --height="1em" flags={player.flags} />
		</div>
	</th>
	<td class="record">
		{wins()}<span class="muted">/{total()} ({winPercentage()})</span>
	</td>
	<td class="rating-ordinal-display">
		<div class={{
			["rating-ordinal"]: true,
			["unrated"]: player.dr == null,
		}}>
			{#if drDisplay() != null}
				{drDisplay()}
				<sub>{drDisplaySub()}</sub>
			{:else if matchesLeft != null}
				Unrated
				<sub>({matchesLeft}/10)</sub>
			{:else}
				Unrated
			{/if}
		</div>
	</td>
	<td class="rank">
		{#if player.rank != null}
			<div>
				<RankDisplay rank={player.rank} --height="1.78em" />
			</div>
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
		padding: 0.75rem;

		&.rating-ordinal-display {
			padding: 0.75rem 0 0.75rem 0.75rem;
		}

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
		text-transform: uppercase;

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

		sub {
			color: var(--text-muted);
			margin-left: 6px;
			font-weight: normal;
		}
	}

	.unrated {
		font-style: italic;
	}

	.header {
		display: flex;
		flex-flow: row wrap;
		font-size: 1em;
		/*align-items: center;*/
		text-transform: uppercase;
		gap: 6px;
	}

	.rank {
		padding: 0 0.75rem;
		width: 1%;

		& > div {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
		}
	}
</style>
