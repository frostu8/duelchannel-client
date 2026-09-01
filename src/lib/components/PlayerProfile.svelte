<script>
	import BadgeDisplay from './BadgeDisplay.svelte';
	import Ordinal from './Ordinal.svelte';
	import RankDisplay from './RankDisplay.svelte';

  /**
   * @typedef {Object} PlayerProfileProps
   * @property {import('$lib/client/players').Player} player
   * The player to render.
   * @property {string | string[]} [class]
   */

  /** @type {PlayerProfileProps} */
  const { player, class: className } = $props();
</script>

<section
  class={["player-profile", className].flat()}
>
  <div class="header">
    {#if player.rank != null}
      <RankDisplay rank={player.rank} --height="2.5em"/>
    {/if}
    <h1><a href="/player/{player.id}">{player.displayName}</a></h1>
  </div>
  <div class="dr">
    {#if player.dr != null}
      <Ordinal ordinal={player.dr} />
      <span class="suffix">DR</span>
    {/if}
  </div>
  <section class="basic-stats">
    <div class="badges">
      <h4>Badges</h4>
      <BadgeDisplay flags={player.flags} --height="2rem"/>
    </div>
    <div>
      <h4>Duel Stats</h4>
      <div class="key-value">
        <p>Duels played</p>
        <div></div>
        <h1>{player.matchesPlayed}</h1>
      </div>
      <div class="key-value">
        <p>Duels won</p>
        <div></div>
        <h1>{Math.floor(player.matchesPlayed * player.winRatio)}</h1>
      </div>
      <div class="key-value">
        <p>Win rate</p>
        <div></div>
        <h1>{(player.winRatio * 100).toFixed(2)}%</h1>
      </div>
    </div>
  </section>
</section>

<style>
  .player-profile {
    & a {
      color: var(--text-secondary);
      font-weight: bold;
      text-decoration: none;

      &:hover {
        color: white;
      }
    }
  }

  .header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 8px;

    margin: 1rem 0 0.5rem 0;

    font-size: 1.5rem;

    & > h1 {
      text-transform: uppercase;
    }
  }

  .dr {
    display: flex;
    flex-flow: row nowrap;
    align-items: baseline;
    font-size: 1.8rem;

    margin-bottom: 1rem;
    color: var(--text-muted);

    & .suffix {
      margin: 0 1rem;
    }
  }

  .basic-stats {
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    gap: 16px;

    color: var(--text-primary);

    width: 360px;
  
    & > div {
      padding: 1rem;
      background-color: var(--bg-secondary);

      border-bottom: 4px solid var(--bg-primary);
    }

    h4 {
      color: var(--text-muted);
      text-align: center;
      text-transform: uppercase;
    }
  }

  .key-value {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
    margin-top: 0.1em;

    & > p {
      color: var(--text-secondary);
      text-transform: uppercase;
    }
    & > h1 {
      font-size: inherit;
      font-weight: bold;
    }
    & > div {
      /* Styling for divider */
      border-bottom: 2px dotted var(--text-muted);
      margin: 0 0.5em;
      flex: 1 0 auto;
    }
  }
</style>

