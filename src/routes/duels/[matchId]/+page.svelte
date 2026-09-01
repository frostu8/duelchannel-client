<script>
	import { asset } from '$app/paths';
	import { getSingleMatch } from '$lib/client/matches.js';
	import KeyValue from '$lib/components/KeyValue.svelte';
	import MarginScore from '$lib/components/MarginScore.svelte';
	import MatchToolbar from '$lib/components/MatchToolbar.svelte';
	import Ordinal from '$lib/components/Ordinal.svelte';
	import OrdinalDelta from '$lib/components/OrdinalDelta.svelte';
	import PlayerProfile from '$lib/components/PlayerProfile.svelte';
	import PlayerNameplate from '$lib/components/profile/PlayerNameplate.svelte';
	import PlayerOrdinal from '$lib/components/profile/PlayerOrdinal.svelte';
	import RouletteItem from '$lib/components/RouletteItem.svelte';
	import { createQuery } from '@tanstack/svelte-query';

  const { params } = $props();

  const query = createQuery(() => ({
    queryKey: ['match', params.matchId],
    queryFn: () => getSingleMatch(fetch, params.matchId),
  }));

  /** @typedef {import('$lib/client/matches').Participant} Participant */

  /**
   * @typedef {Participant & { outcome: "victory" | "defeat" | "no_contest"}} ParticipantDetail
   */

  /**
   * @param {import('$lib/client/matches').Skin} skin
   * @return {string}
   */
  function skinClass(skin) {
	  const CLASSES = [
	    "Class A", "Class B", "Class C",
	    "Class D", "Class E", "Class F",
	    "Class G", "Class H", "Class I",
	  ];

	  let x = Math.min(Math.floor((Math.max(skin.kartSpeed, 1) - 1) / 3), 2);
	  let y = Math.min(Math.floor((Math.max(skin.kartWeight, 1) - 1) / 3), 2);

	  return CLASSES[y * 3 + x];
  }

  /**
   * @param {function(Participant[]): Participant | null} filter
   * @returns {ParticipantDetail | null}
   */
  function resolvePlayer(filter) {
	  if (query.data == null) return null;

	  const player = filter(query.data.participants);
	  if (player == null) return null;

	  // Calculate roulette info, folding stack counts
	  const roulette = Array.from(
		  player
			  .roulette
			  .reduce((table, { item, stack, count }) => {
			  	let itemEntry = table.getOrInsert(item, {
			  		item,
			  		stack: 1,
			  		count: 0,
			  	});

			  	itemEntry.count += stack * count;
			  	return table;
			  }, new Map())
			  .entries()
			  .map(([_key, value]) => value)
		);

		if (!query.data.rated) {
			return { ...player, roulette, outcome: 'no_contest' };
		} else if (player.noContest) {
			return { ...player, roulette, outcome: 'defeat' };
		} else {
			return { ...player, roulette, outcome: 'victory' };
		}
  }

  /**
   * @param {"victory" | "defeat" | "no_contest"} outcome
   * @returns {string}
   */
  function humanReadableOutcome(outcome) {
  	switch (outcome) {
  		case 'victory':
  			return 'VICTORY';
  		case 'defeat':
  			return 'DEFEAT';
  		case 'no_contest':
  			return 'NO CONTEST';
  	}
  }

  const playerSelf = $derived(resolvePlayer(p => p[0]));
  const playerOpponent = $derived(resolvePlayer(p => p[1]));

  const dateTime = () => {
  	if (query.data == null) return null;

  	const date = new Date(query.data.startedAt)
  	return new Intl.DateTimeFormat('en-US', {
  		dateStyle: 'full',
  		timeStyle: 'long',
  	}).format(date);
  };

	const levelImgUrl = $derived(query.data ? asset(`/thumbnails/${query.data.levelId}.png`) : null);
</script>

<article class="match-summary">
	{#if query.data != null}
	<div
		class="level-title"
		style={levelImgUrl != null ? `--title-bg: url(${levelImgUrl})` : ""}
	>
		<h1>{query.data.levelName}</h1>
		<MarginScore margin={query.data.marginScore} --height="4rem" class="margin-score"/>
	</div>
	<div class="level-subtitle">
		<h2>{dateTime()}</h2>
		<KeyValue key="Margin Boost" value={query.data.marginScore || '—'} />
		<MatchToolbar match={query.data}/>
	</div>
	{/if}
	{#snippet playerCard(/** @type {ParticipantDetail} */ player, /** @type {boolean} */ right = false)}
	  {#if player != null}
			{@const text = right
				? `${humanReadableOutcome(player.outcome)} – ${player.score}`
				: `${player.score} – ${humanReadableOutcome(player.outcome)}`}
			<div
				class={{
					['outcome']: true,
					['victory']: player.outcome === 'victory',
					['defeat']: player.outcome === 'defeat',
	    		['float-left']: !right,
					['float-right']: right,
				}}
			>
				<span>{text}</span>
			</div>
			<PlayerNameplate {...player.user} class={{['float-right']: right}}/>
			{#if player.user.dr != null}
				<PlayerOrdinal dr={player.user.dr} class={{['float-right']: right}} />
			{/if}
	    <PlayerProfile
	    	player={player.user}
	    	showHeader={false}
	    	showBadges={false}
	    	class={{
	    		['float-left']: !right,
	    		['float-right']: right,
	    	}}
	    >
	    	<div class="card">
	    		{#if player.skin != null}
		    		<h4>Character</h4>
		    		<KeyValue key="Name" value={player.skin.realName}/>
		    		<KeyValue key="Engine class" value={skinClass(player.skin)}/>
		    		<KeyValue key="Engine stats" value={`s${player.skin.kartSpeed} w${player.skin.kartWeight}`}/>
	    		{/if}
	    		<h4>Items rolled</h4>
	    		<ul class="roulette-detail">
	    			{#each player.roulette as item}
	    				<RouletteItem {item} --height="3.4rem"/>
	    			{/each}
	    		</ul>
	    		{#if player.dr != null || player.drDelta != null}
		    		<h4>Duel Rating</h4>
	    		{/if}
	    		{#if player.dr != null}
		    		<KeyValue key="DR (time of duel)">
		    			<Ordinal ordinal={player.dr}/>
		    		</KeyValue>
	    		{/if}
	    		{#if player.drDelta != null}
		    		<KeyValue key="DR gain/loss">
			    		{#if player.outcome !== 'no_contest'}
			    			<OrdinalDelta delta={player.drDelta}/>
			    		{:else}
			    			–
		    			{/if}
		    		</KeyValue>
	    		{/if}
	    	</div>
	    </PlayerProfile>
	  {/if}
	{/snippet}
	{#if playerSelf != null}
		{@render playerCard(playerSelf)}
	{/if}
	{#if playerOpponent != null}
		{@render playerCard(playerOpponent, true)}
	{/if}
</article>

<style>
  .match-summary {
    width: 960px;
    height: 100%;
    margin: 2rem auto 0 auto;
    overflow: scroll;

    display: grid;
    grid-template: auto / 1fr 10rem 1fr;

    :global(& .margin-score) {
    	margin: 0.5rem 1rem;
    	height: 0;
    	overflow: visible;
    }

    :global(& .float-left) {
    	grid-column: 1;
    }

    :global(& .float-right) {
    	grid-column: 3;
    }

    :global(& .player-nameplate) {
	  	font-size: 1em;
    	grid-row: 4;
    }

    :global(& .player-ordinal) {
	  	font-size: 1.5em;
    	grid-row: 5;
    }
  }

  .level-title {
  	grid-row: 1;
  	grid-column: 1 / span 3;

  	position: relative;
  	z-index: 1;

  	color: var(--text-primary);
  	-webkit-text-stroke: 4px var(--bg-base);
  	paint-order: stroke fill;

  	display: flex;
  	flex-flow: row nowrap;
  	justify-content: space-between;
  	align-items: center;

  	margin: 0.6rem 0;

  	&::before {
  		content: '';
  		position: absolute;
  		inset: 0;
  		z-index: -1;

	  	background: var(--title-bg) right / 80% no-repeat;
	  	image-rendering: crisp-edges;

			/* Linear gradients */
			-webkit-mask-image: linear-gradient(75deg, transparent 40%, black 70%);
			mask-image: linear-gradient(75deg, transparent 40%, black 70%);
  	}

  	& h1 {
  		font-size: 2.5rem;
  		text-transform: uppercase;
  	}
  }

  .level-subtitle {
  	grid-row: 2;
  	grid-column: 1 / span 3;

  	display: flex;
  	flex-flow: row nowrap;
  	align-items: center;

  	margin: 0.6rem 0;

  	& h2 {
  		font-size: 1rem;
  		font-weight: normal;
  		color: var(--text-muted);
  		flex: 1 0 auto;
  	}

  	:global(& > .key-value) {
  		width: 14rem;
  		margin: 0 1rem;
  	}

		:global(& > .key-value p) {
			color: var(--text-muted);
		}

		:global(& > .key-value h1) {
			color: var(--text-secondary);
		}
  }

  .outcome {
  	font-weight: bold;
  	font-size: 1.2rem;

  	grid-row: 3;

  	position: relative;
  	padding: 0.25rem 0.8rem;

  	width: 12rem;
  	height: min-content;
  	align-self: end;

		--entry-color: var(--bg-secondary);
		--entry-fade-color: var(--bg-base);
		--entry-text-color: var(--text-muted);

		color: var(--entry-text-color);
		background: linear-gradient(to right, var(--entry-fade-color) 0%, var(--entry-color) 80%);

		&.victory {
			--entry-color: #ffa742;
			--entry-fade-color: #e66d27;
			--entry-text-color: black;
		}

		&.defeat {
			--entry-color: #8b8bff;
			--entry-fade-color: #6445d6;
			--entry-text-color: black;
		}

  	&.float-right {
	  	text-align: right;
  		justify-self: end;
			background: linear-gradient(to left, var(--entry-fade-color) 0%, var(--entry-color) 80%);
  	}

  	&:not(.float-right)::after {
  		content: '';
  		position: absolute;
  		top: 0;
  		left: 100%;

  		width: 16px;
  		height: 100%;

  		background-color: var(--entry-color);
  		clip-path: polygon(0 0, 100% 50%, 0 100%);
  	}

  	&.float-right::after {
  		content: '';
  		position: absolute;
  		top: 0;
  		left: -16px;

  		width: 16px;
  		height: 100%;

  		background-color: var(--entry-color);
  		clip-path: polygon(100% 0, 0 50%, 100% 100%);
  	}
  }

  .score {
  	font-weight: bold;
  	color: var(--text-muted);

  	text-align: center;

  	margin: 1rem 0 0.5rem 0;

  	grid-row: 3 / span 2;
  	grid-column: 2;
  }

  .roulette-detail {
  	margin: 0.5rem 1.2rem;

  	display: flex;
  	flex-flow: row wrap;
  }

  :global(.match-summary .player-nameplate.float-right),
  :global(.match-summary .player-ordinal.float-right) {
    flex-flow: row-reverse nowrap;
  }
</style>
