<script>
	import { asset } from '$app/paths';
	import MarginScore from './MarginScore.svelte';
	import RankDisplay from './RankDisplay.svelte';

	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiDownload, mdiDownloadOffOutline } from '@mdi/js';

	/**
	 * @typedef {Object} PlayerListEntryProps
	 * @property {import('$lib/client/matches').Match} match
	 * The match to render.
	 */

	/** @type {PlayerListEntryProps} */
	let { match } = $props();

	const TICRATE = 35;

	/**
	 * Converts tics to minutes.
	 *
	 * @param {number} tics
	 * @returns {number}
	 */
	function ticsToMinutes(tics) {
		return Math.floor(tics / (60 * TICRATE));
	}

	/**
	 * Converts tics to seconds.
	 *
	 * @param {number} tics
	 * @returns {number}
	 */
	function ticsToSeconds(tics) {
		return Math.floor((tics / TICRATE) % 60);
	}

	/**
	 * Converts tics to centiseconds.
	 *
	 * @param {number} tics
	 * @returns {number}
	 */
	function ticsToCentiseconds(tics) {
		return Math.floor((tics % TICRATE) * (100 / TICRATE));
	}

	let playerLeft = $derived.by(() => {
		if (match.participants.length == 2) {
			let [playerLeft, _] = match.participants;
			return playerLeft;
		} else {
			return null;
		}
	});
	let playerRight = $derived.by(() => {
		if (match.participants.length == 2) {
			let [_, playerRight] = match.participants;
			return playerRight;
		} else {
			return null;
		}
	});

	let score = () => {
		if (!playerLeft?.score && !playerRight?.score) return '-';

		return `${playerLeft?.score} - ${playerRight?.score}`;
	};

	let finishTime = () => {
		const participants = match.participants.map((p) => p.finishTime).filter((p) => p != null);

		if (participants.length === 0) return null;
		const timeTics = participants.reduce((acc, x) => {
			if (acc < x) {
				return acc;
			} else {
				return x;
			}
		});

		if (timeTics != null) {
			const minutes = ticsToMinutes(timeTics).toString().padStart(2, '0');
			const seconds = ticsToSeconds(timeTics).toString().padStart(2, '0');
			const centiSeconds = ticsToCentiseconds(timeTics).toString().padStart(2, '0');

			return `${minutes}'${seconds}"${centiSeconds}`;
		} else {
			return null;
		}
	};
</script>

<tr class="match-card">
	<th scope="col" class="score text">
		<span>{score()}</span>
	</th>
	<td class="map-col">
		<img
			src={asset(`/thumbnails/${match.levelId}.png`)}
			alt={match.levelName}
			draggable="false"
		/>
	</td>
	<td class="text finish-time">
		{#if finishTime() != null}
			{finishTime()}
		{:else}
			––'––"––
		{/if}
	</td>
	{#snippet playerCard(
		/** @type {import('$lib/client/matches').Participant} */ player,
		/** @type {boolean} */ right = false
	)}
		<td>
			<div
				class={{
					['player-card']: true,
					['right']: right
				}}
			>
				{#if player.user.rank != null && !right}
					<RankDisplay rank={player.user.rank} --height="1.5em" />
				{/if}
				<div>
					<a href="/player/{player.user.id}">
						{player.user.displayName}
					</a>
				</div>
				{#if player.user.rank != null && right}
					<RankDisplay rank={player.user.rank} --height="1.5em" />
				{/if}
			</div>
		</td>
	{/snippet}
	{#if playerRight != null && playerLeft != null}
		{@render playerCard(playerLeft)}
		<td class="text"> vs </td>
		{@render playerCard(playerRight, true)}
	{/if}
	<td class="margin-score">
		{#if match.marginScore > 0}
			<MarginScore margin={match.marginScore} --height="2em" />
		{/if}
	</td>
	<td class="text">
		<div class="match-toolbar">
			{#if match.replayUrl != null}
				<a class="replay-btn" href={match.replayUrl}>
					<SvgIcon type="mdi" path={mdiDownload}></SvgIcon>
				</a>
			{:else}
				<span title="The replay was lost or otherwise expired.">
					<SvgIcon type="mdi" path={mdiDownloadOffOutline}></SvgIcon>
				</span>
			{/if}
		</div>
	</td>
</tr>

<style>
	th {
		font-weight: normal;
	}

	.player-card {
		display: flex;
		flex-flow: row nowrap;
		gap: 8px;
		align-items: center;

		&.right {
			justify-content: flex-end;
		}

		& > div {
			flex: 0 1 auto;
			max-width: 10em;
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
	}

	.text {
		color: var(--text-secondary);
		text-align: center;
		padding: 0.75rem;
	}

	.finish-time {
		color: var(--text-muted);
	}

	.map-col {
		width: 1%;

		& > img {
			display: block;
			width: 8em;
			height: 2.5em;
			object-fit: cover;
			object-position: center;

			/* Linear gradients */
			-webkit-mask-image: linear-gradient(
				to right,
				transparent 0%,
				black 25%,
				black 75%,
				transparent 100%
			);
			mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);
		}
	}

	.match-toolbar {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
	}

	.replay-btn {
		color: var(--text-secondary);

		&:hover {
			color: white;
		}
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
