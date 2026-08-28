<script>
	//import CounterDigit from './CounterDigit.svelte';
	import CounterDigitSmall from './CounterDigitSmall.svelte';

	/**
	 * @typedef {Object} CounterProps
	 * @property {!number} number - The number to display on the counter.
	 * @property {number} [padding=0] - How much padding to apply to the display.
	 * @property {string} [height="1.5em"] - The height of the counter.
	 * @property {boolean} [small=false] - If small digits should be used to draw the
	 * counter.
	 * @property {string | string[]} [class] - Class names to apply.
	 * @property {import('svelte').Snippet} [children] - The component's children.
	 */

	/** @type {CounterProps} */
	let {
		number,
		padding = 0,
		height = '1.5em',
		small = false,
		class: className,
		children
	} = $props();

	let digitCount = $derived.by(() => {
		let ix = 0;
		let working = number;

		while (working > 0) {
			working = Math.trunc(working / 10);
			ix++;
		}

		return ix;
	});

	let digits = $derived([...Array(Math.max(digitCount, padding)).keys()].reverse());
	let containerClass = () => className ?? [];
</script>

<div class={['counter', ...containerClass()]}>
	{#if small}
		{#each digits as digitNum}
			<CounterDigitSmall {number} {digitNum} --height={height} />
		{/each}
	{:else}
		<!--
  {#each digits as digitNum}
    <CounterDigit {number} {digitNum} --height={height} />
  {/each}
  -->
	{/if}
	{@render children?.()}
</div>

<style>
	.counter {
		width: min-content;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
	}
</style>
