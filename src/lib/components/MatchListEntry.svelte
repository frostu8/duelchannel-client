<script lang="ts">
	import { asset, resolve } from '$app/paths';
	import MarginScore from './MarginScore.svelte';
	import MatchToolbar from './MatchToolbar.svelte';
	import OrdinalDelta from './OrdinalDelta.svelte';
	import RankDisplay from './RankDisplay.svelte';
	import { formatFinishTime, type Match, type Participant } from '$lib/client/matches';

	type Outcome = 'victory' | 'defeat' | 'no_contest';

	interface Props {
		/** The match to render. */
		match: Match;
		/** How the entry should render. */
		outcome?: Outcome | null;
		/** Only show the opponent (the second participant). */
		showOpponentOnly?: boolean;
	}

	let { match, outcome, showOpponentOnly = false }: Props = $props();

	let playerSelf = $derived.by(() => {
		if (match.participants.length == 2) {
			let [playerLeft] = match.participants;
			return playerLeft;
		} else {
			return null;
		}
	});
	let playerOpponent = $derived.by(() => {
		if (match.participants.length == 2) {
			let [, playerRight] = match.participants;
			return playerRight;
		} else {
			return null;
		}
	});

	let score = () => {
		if (!playerSelf?.score && !playerOpponent?.score) return null;
		return `${playerSelf?.score} - ${playerOpponent?.score}`;
	};

	let finishTime = () => formatFinishTime(match);
	let levelImg = () => asset(`/thumbnails/${match.levelId}.png`);
</script>

<tr
	class={{
		['match-card']: true,
		['opponent-only']: showOpponentOnly,
		['victory']: outcome === 'victory',
		['defeat']: outcome === 'defeat'
	}}
>
	<th scope="col">
		<a href={resolve(`/duels/${match.id}`)}>
			{#if outcome === 'victory'}
				<span>VICTORY {score()}</span>
			{:else if outcome === 'defeat'}
				<span>DEFEAT {score()}</span>
			{:else if outcome === 'no_contest'}
				<span>NO CONTEST</span>
			{:else}
				<span>{score() ? score() : '-'}</span>
			{/if}
		</a>
	</th>
	{#snippet playerCard(player: Participant, right: boolean = false)}
		<td>
			<div
				class={{
					['player-card']: true,
					['float-right']: right
				}}
			>
				{#if player.user.rank != null && !right}
					<RankDisplay rank={player.user.rank} --height="1.5em" />
				{/if}
				<div>
					<a href={resolve(`/player/${player.user.id}`)}>
						{player.user.displayName}
					</a>
				</div>
				{#if player.user.rank != null && right}
					<RankDisplay rank={player.user.rank} --height="1.5em" />
				{/if}
			</div>
		</td>
	{/snippet}
	{#if playerOpponent != null && playerSelf != null}
		<!-- Note, we can skip the first player if we're already scoped
			to a user -->
		{#if !showOpponentOnly}
			{@render playerCard(playerSelf)}
		{/if}
		<td class="vs-text">vs</td>
		{@render playerCard(playerOpponent, !showOpponentOnly)}
	{/if}
	<td class="map-col" style={`--level-image: url(${levelImg()})`}>
		<a href={resolve(`/duels/${match.id}`)}>
			Duel on {match.levelName}
		</a>
	</td>
	<td class="text finish-time">
		{#if finishTime() != null}
			{finishTime()}
		{:else}
			––'––"––
		{/if}
	</td>
	<td class="margin-score">
		{#if match.marginScore > 0}
			<MarginScore margin={match.marginScore} --height="2.5em" />
		{/if}
	</td>
	{#if showOpponentOnly}
		<td class="text ordinal-delta">
			{#if outcome === 'no_contest'}
				–
			{:else if playerSelf?.drDelta != null}
				<OrdinalDelta delta={playerSelf.drDelta} />
			{:else}
				–
			{/if}
		</td>
	{/if}
	<td class="text">
		<MatchToolbar {match} />
	</td>
</tr>

<style>
	.player-card {
		display: flex;
		margin: 0 16px;

		flex-flow: row nowrap;
		gap: 8px;
		align-items: center;

		&.float-right {
			justify-content: flex-end;
		}

		& > div {
			flex: 0 1 auto;
			max-width: 12em;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		& a {
			text-transform: uppercase;
			color: var(--text-secondary);
			font-weight: bold;
			text-decoration: none;

			&:hover {
				color: white;
			}
		}
	}

	.match-card {
		color: var(--text-primary);
		background-color: var(--bg-primary);

		&:nth-child(even) {
			background-color: var(--bg-secondary);
		}

		--entry-color: var(--bg-base);
		--entry-fade-color: var(--bg-base);
		--entry-text-color: var(--text-muted);

		&.victory {
			--entry-color: #ffa742;
			--entry-fade-color: #e66d27;
			--entry-text-color: black;

			& th {
				font-weight: bold;
			}
		}

		&.defeat {
			--entry-color: #8b8bff;
			--entry-fade-color: #6445d6;
			--entry-text-color: black;

			& th {
				font-weight: bold;
			}
		}
	}

	.opponent-only {
		.player-card {
			margin-left: 0;
		}

		.vs-text {
			padding: 0 0.75em;
		}
	}

	.text {
		color: var(--text-secondary);
		text-align: center;
		padding: 0.75rem;
	}

	.vs-text {
		color: var(--text-muted);
		text-align: center;
		padding: 0.75rem 0;
	}

	.finish-time {
		color: var(--text-muted);
	}

	.ordinal-delta {
		color: var(--text-secondary);
	}

	.map-col {
		width: 8em;

		object-fit: cover;
		object-position: center;
		background: var(--level-image) right / cover no-repeat;

		/* Linear gradients */
		-webkit-mask-image: linear-gradient(
			to right,
			transparent 0%,
			black 25%,
			black 75%,
			transparent 100%
		);
		mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);

		position: relative;

		& > a {
			display: block;
			opacity: 0;

			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
	}

	.replay-btn {
		color: var(--text-secondary);

		&:hover {
			color: white;
		}
	}

	th {
		font-size: inherit;
		text-align: right;

		align-self: stretch;

		position: relative;
		padding: 1rem;
		margin-right: 0.5rem;
		transform: translate(0, 1px);

		color: var(--entry-text-color);
		background: linear-gradient(to right, var(--entry-fade-color) 0%, var(--entry-color) 80%);

		& a {
			color: var(--entry-text-color);
			text-decoration: none;
		}

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 100%;

			width: 12px;
			height: calc(100% - 2px);

			background-color: var(--entry-color);
			clip-path: polygon(0 0, 100% 100%, 0 100%);
		}
	}

	td {
		border-bottom: 2px solid var(--entry-color);
	}

	:global(.replay-btn > svg) {
		display: block;
	}

	:global(.match-toolbar > span > svg) {
		/* muted text for inaccessible icons */
		color: var(--text-muted);
		display: block;
	}
</style>
