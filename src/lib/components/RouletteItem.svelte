<script>
  import itemBanana from '$lib/assets/items-4p/K_ISBANA.png';
  import itemBallhog from '$lib/assets/items-4p/K_ISBHOG.png';
  import itemBubbleShield from '$lib/assets/items-4p/K_ISBUBS.png';
  import itemDropTarget from '$lib/assets/items-4p/K_ISDTRG.png';
  import itemEggmark from '$lib/assets/items-4p/K_ISEGGM.png';
  import itemFlameShield from '$lib/assets/items-4p/K_ISFLMS.png';
  import itemGachabom from '$lib/assets/items-4p/K_ISGBOM.png';
  import itemGrow from '$lib/assets/items-4p/K_ISGROW.png';
  import itemGardenTop from '$lib/assets/items-4p/K_ISGTOP.png';
  import itemHyudoro from '$lib/assets/items-4p/K_ISHYUD.png';
  import itemJawz from '$lib/assets/items-4p/K_ISJAWZ.png';
  import itemLandmine from '$lib/assets/items-4p/K_ISLNDM.png';
  import itemProximityMine from '$lib/assets/items-4p/K_ISMINE.png';
  import itemOrbinaut from '$lib/assets/items-4p/K_ISORBN.png';
  import itemPogoSpring from '$lib/assets/items-4p/K_ISPOGO.png';
  import itemSuperring from '$lib/assets/items-4p/K_ISRING.png';
  import itemRocketSneaker from '$lib/assets/items-4p/K_ISRSHE.png';
  import itemSneaker from '$lib/assets/items-4p/K_ISSHOE.png';
  import itemShrink from '$lib/assets/items-4p/K_ISSHRK.png';
  import itemKitchenSink from '$lib/assets/items-4p/K_ISSINK.png';
  import itemSelfPropelledBomb from '$lib/assets/items-4p/K_ISSPB.png';
  import itemStoneShoe from '$lib/assets/items-4p/K_ISSTON.png';
  import itemThunderShield from '$lib/assets/items-4p/K_ISTHNS.png';
  import itemToxomister from '$lib/assets/items-4p/K_ISTOX.png';

  // It's kinda cute that the invincibility is animated but because I want to
  // stay consistent I must sentence myself to a life of rerunning scripts.
  import itemInvincibility from '$lib/assets/items-4p/animated/invincibility.gif';
	import Counter from './counter/Counter.svelte';

  /** @typedef {import('$lib/client/matches').KartItem} KartItem */

  /**
   * @typedef {Object} RouletteItemProps
   * @property {import('$lib/client/matches').ItemUsage} item
   * The item to display information for.
   */

  /** @type {RouletteItemProps} */
  const { item } = $props();

  /**
   * @typedef {Object} ItemDetail
   * @property {string} src
   * @property {string} name
   */

  /** @type {Record<KartItem, ItemDetail>} */
  const ITEM_MAP = {
    'banana': {
      src: itemBanana,
      name: 'Banana',
    },
    'ballhog': {
      src: itemBallhog,
      name: 'Ballhog',
    },
    'bubble_shield': {
      src: itemBubbleShield,
      name: 'Bubble Shield',
    },
    'drop_target': {
      src: itemDropTarget,
      name: 'Drop Target',
    },
    'eggman': {
      src: itemEggmark,
      name: 'Eggmark',
    },
    'flame_shield': {
      src: itemFlameShield,
      name: 'Flame Shield',
    },
    'gachabom': {
      src: itemGachabom,
      name: 'Gachabom',
    },
    'grow': {
      src: itemGrow,
      name: 'Grow',
    },
    'garden_top': {
      src: itemGardenTop,
      name: 'Gardentop',
    },
    'hyudoro': {
      src: itemHyudoro,
      name: 'Hyudoro',
    },
    'invincibility': {
      src: itemInvincibility,
      name: 'Invincibility',
    },
    'jawz': {
      src: itemJawz,
      name: 'Jawz',
    },
    'landmine': {
      src: itemLandmine,
      name: 'Land Mine',
    },
    'proximity_mine': {
      src: itemProximityMine,
      name: 'Proximity Mine',
    },
    'orbinaut': {
      src: itemOrbinaut,
      name: 'Orbinaut',
    },
    'pogo_spring': {
      src: itemPogoSpring,
      name: 'Pogo Spring',
    },
    'super_ring': {
      src: itemSuperring,
      name: 'Super Ring',
    },
    'rocket_sneaker': {
      src: itemRocketSneaker,
      name: 'Rocket Sneaker',
    },
    'sneaker': {
      src: itemSneaker,
      name: 'Sneaker',
    },
    'shrink': {
      src: itemShrink,
      name: 'Shrink',
    },
    'kitchen_sink': {
      src: itemKitchenSink,
      name: 'Kitchen Sink',
    },
    'spb': {
      src: itemSelfPropelledBomb,
      name: 'Self-Propelled Bomb',
    },
    'stone_shoe': {
      src: itemStoneShoe,
      name: 'Stone Shoe',
    },
    'lightning_shield': {
      src: itemThunderShield,
      name: 'Lightning Shield',
    },
    'toxomister': {
      src: itemToxomister,
      name: 'Toxomister',
    },
  };

  const title = () => {
    const { name } = ITEM_MAP[item.item];
    return `${name} x${item.stack}`;
  };
</script>

<li class="roulette-item">
  <img
    src={ITEM_MAP[item.item].src}
    alt={title()}
    title={title()}
    draggable="false"
  >
  <div class="roulette-item-stack">
    <Counter number={item.count} height="1em"/>
  </div>
</li>

<style>
  .roulette-item {
    position: relative;
    list-style: none;
    width: min-content;
    font-size: 125%;

    & > img {
      image-rendering: crisp-edges;
      height: var(--height, 1rem);
    }
  }

  .roulette-item-stack {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }
</style>
