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

  let score = () => `${playerLeft?.score} - ${playerRight?.score}`;
</script>

<tr class="match-card">
  <th scope="col" class="header text">
    <span>{score()}</span>
  </th>
  <td>
    <img
    	class="map-thumbnail"
    	src={asset(`/thumbnails/${match.levelId}.png`)}
    	alt={match.levelName}
    	draggable="false"
    />
  </td>
	{#snippet playerCard(/** @type {import('$lib/client/matches').Participant} */ player, /** @type {boolean} */ right = false)}
		<td>
  		<div class={{
  			["player-card"]: true,
  			["right"]: right,
	  	}}>
  			{#if player.user.rank != null && !right}
  				<div class="rank">
		  			<RankDisplay rank={player.user.rank} --height="1.5em"/>
	  			</div>
  			{/if}
		  	<a href="/player/{player.user.id}">
		  		{player.user.displayName}
		  	</a>
  			{#if player.user.rank != null && right}
  				<div class="rank">
		  			<RankDisplay rank={player.user.rank} --height="1.5em"/>
	  			</div>
  			{/if}
  		</div>
		</td>
	{/snippet}
	{#if playerRight != null && playerLeft != null}
		{@render playerCard(playerRight)}
  	<td class="text">
  		vs
  	</td>
		{@render playerCard(playerLeft, true)}
	{/if}
	<td class="margin-score">
		{#if match.marginScore > 0}
			<MarginScore margin={match.marginScore} --height="2em"/>
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
	.player-card {
		display: flex;
		flex-flow: row nowrap;
		gap: 8px;
		align-items: center;

		&.right {
			justify-content: flex-end;
		}

		& > a {
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

	.map-thumbnail {
		display: block;
	  width: 8em;
	  height: 2.5em;
  	object-fit: cover;
  	object-position: center;

  	/* Linear gradients */
  	-webkit-mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);
  	mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);
	}

	.margin-score {
		font-weight: bold;
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

	.rank {
		margin: 0 0.5em;
	}
</style>
