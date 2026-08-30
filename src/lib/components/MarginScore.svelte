<script>
  import mb00 from '$lib/assets/margin-boost/DUELMB00.png';
  import mb01 from '$lib/assets/margin-boost/DUELMB01.png';
  import mb02 from '$lib/assets/margin-boost/DUELMB02.png';
  import mb03 from '$lib/assets/margin-boost/DUELMB03.png';
  import mb04 from '$lib/assets/margin-boost/DUELMB04.png';
  import mb05 from '$lib/assets/margin-boost/DUELMB05.png';
  import mb06 from '$lib/assets/margin-boost/DUELMB06.png';
  import mb07 from '$lib/assets/margin-boost/DUELMB07.png';
  import mb08 from '$lib/assets/margin-boost/DUELMB08.png';
  import mb09 from '$lib/assets/margin-boost/DUELMB09.png';
  import mb10 from '$lib/assets/margin-boost/DUELMB10.png';
  import mb11 from '$lib/assets/margin-boost/DUELMB11.png';
  import mb12 from '$lib/assets/margin-boost/DUELMB12.png';
  import mb13 from '$lib/assets/margin-boost/DUELMB13.png';
  import mb14 from '$lib/assets/margin-boost/DUELMB14.png';
  import mb15 from '$lib/assets/margin-boost/DUELMB15.png';
  import mb16 from '$lib/assets/margin-boost/DUELMB16.png';
  import mb17 from '$lib/assets/margin-boost/DUELMB17.png';
  import mb18 from '$lib/assets/margin-boost/DUELMB18.png';
  import mb19 from '$lib/assets/margin-boost/DUELMB19.png';
  import mb20 from '$lib/assets/margin-boost/DUELMB20.png';
  import mb21 from '$lib/assets/margin-boost/DUELMB21.png';
  import mb22 from '$lib/assets/margin-boost/DUELMB22.png';
  import mb23 from '$lib/assets/margin-boost/DUELMB23.png';

  /**
   * @typedef {Object} MarginScoreProps
   * @property {number} margin - The margin score to display.
   */

  // Hey KKD! I want to leave a note here to say that I appreciate you
  // suffering through the margin boost HUD code so I could have a slightly
  // less bad time -frostu8 2026-08-29

  /** @type {MarginScoreProps} */
  let { margin: rawMargin } = $props();

  let magic = $state(Math.random());

  const SYMBOL_TABLE = [
    { src: mb00, alt: 'Margin Boost' },
    { src: mb01, alt: 'Margin Boost' },
    { src: mb02, alt: 'Margin Boost' },
    { src: mb03, alt: 'Margin Boost' },
    { src: mb04, alt: 'Margin Boost' },
    { src: mb05, alt: 'Margin Boost' },
    { src: mb06, alt: 'Margin Boost' },
    { src: mb07, alt: 'Margin Boost' },
    { src: mb08, alt: 'Margin Boost' },
    { src: mb09, alt: 'Margin Boost' },
    { src: mb10, alt: 'Margin Boost' },
    { src: mb11, alt: 'Margin Boost' },
    { src: mb12, alt: 'Margin Boost' },
    { src: mb13, alt: 'Margin Boost' },
    { src: mb14, alt: 'Margin Boost' },
    { src: mb15, alt: 'Margin Boost' },
    { src: mb16, alt: 'Margin Boost' },
    { src: mb17, alt: 'Margin Boost' },
    { src: mb18, alt: 'Margin Boost' },
    { src: mb19, alt: 'Margin Boost' },
    { src: mb20, alt: 'Margin Boost' },
    { src: mb21, alt: 'Margin Boost' },
    { src: mb22, alt: 'Margin Boost' },
    { src: mb23, alt: 'Margin Boost' },
  ];

  // Define some constants ripped from src/k_hud.cpp
  const BOOSTS_PER_SYMBOL = 3;
  const SYMBOLS_PER_UPGRADE = 5;
  const SYMBOL_HEADROOM = 5;
  const MARGIN_LEVELS = SYMBOL_TABLE.length;

  const SYMBOL_COUNT = 5;

  let marginLevel = () => {
    const margin = rawMargin - 1; // lol

    const highSymbol = Math.floor(margin / BOOSTS_PER_SYMBOL) + 1;
    const frac = margin % BOOSTS_PER_SYMBOL;
    const minSymbol = Math.max(1, highSymbol - SYMBOL_HEADROOM);
    const symbolHeadroomInUse = highSymbol - minSymbol;

    const minScore = Math.pow(SYMBOLS_PER_UPGRADE, symbolHeadroomInUse + 1);
    const maxScore = Math.pow(SYMBOLS_PER_UPGRADE, symbolHeadroomInUse + 2) - 1;

    const lowBound = frac / BOOSTS_PER_SYMBOL;
    const highBound = (frac + 1) / BOOSTS_PER_SYMBOL;
    const roll = (highBound - lowBound) * magic + lowBound;

    return {
      rawMargin: margin,
      margin: Math.floor((maxScore - minScore) * roll + minScore),
      frac,
      minSymbol,
      symbolHeadroomInUse,
    };
  };
  let symbols = () => {
    let { rawMargin, margin, frac, symbolHeadroomInUse, minSymbol } = marginLevel();

    /** @type Array<number> */
    const marginDigits = Array(SYMBOL_COUNT).fill(-1);
    let marginDigitsLen = 0;

    if (rawMargin / BOOSTS_PER_SYMBOL > MARGIN_LEVELS) {
      // We're capped out, show 5 chaos.
      marginDigitsLen = SYMBOL_COUNT;
      marginDigits.fill(MARGIN_LEVELS - 1);
    } else {
      // Semi-complicated algorithm; you can read more in src/k_hud.c
      // Not transpiling the whole comment describing it but it's cool.
      while (margin > 0) {
        let significantMargin = 0;
        for (let i = symbolHeadroomInUse + 1; i >= 0; i--) {
          const test = Math.pow(SYMBOLS_PER_UPGRADE, i);

          if (margin >= test) {
            significantMargin = i;
            break;
          }
        }

        const index = significantMargin;
        marginDigits[marginDigitsLen] = index + minSymbol - 1;

        marginDigitsLen++;

        margin -= Math.pow(SYMBOLS_PER_UPGRADE, index);

        if (marginDigitsLen >= 3 + frac) break;
      }
    }

    return Array.from(marginDigits
      .entries()
      .map(([i, symbolIndex]) => ({ index: i, ...SYMBOL_TABLE[symbolIndex] }))
      .take(marginDigitsLen));
  };
</script>

<div class="margin-score">
  {#each symbols() as symbol}
    <img
      src={symbol.src}
      alt={symbol.alt}
      draggable="false"
      style:z-index={SYMBOL_COUNT - symbol.index}
    />
  {/each}
</div>

<style>
  .margin-score {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin-left: 24px;
  }

  img {
    image-rendering: crisp-edges;
    height: var(--height, 1rem);
    margin-left: calc(var(--height, 1rem) * -1 / 2);
  }
</style>
