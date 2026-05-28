<script>
  import UserFlags, { all } from '$lib/UserFlags.js';

  import badgeBetaTester from '$lib/assets/badges/beta_tester.png';
  import badgeBetaChallenger from '$lib/assets/badges/beta_challenger.png';

  /**
   * @typedef {Object} MiniBadgeDisplayProps
   * @property {number} flags - The flags to display.
   */

  /** @type {MiniBadgeDisplayProps} */
  let { flags } = $props();

  let allBadges = all()
    .map((flag) => {
      switch (flag) {
        case UserFlags.BETA_TESTER:
          return { flag, src: badgeBetaTester, alt: "Beta Tester" };
        case UserFlags.BETA_CHALLENGER:
          return { flag, src: badgeBetaChallenger, alt: "Beta Challenger" };
        default:
          return null;
      }
    })
    .filter((badge) => badge !== null);

  let badges = $derived.by(() => {
    return allBadges.filter((badge) => flags & badge.flag);
  });
</script>

<div>
  {#each badges as badge}
    <img
      src={badge.src}
      alt={badge.alt}
      draggable="false"
    />
  {/each}
</div>

<style>
  img {
    image-rendering: crisp-edges;
    height: var(--height, 1em);
    margin: 0 2px;
  }
</style>
