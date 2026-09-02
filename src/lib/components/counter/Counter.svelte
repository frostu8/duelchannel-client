<script lang="ts">
	import CounterDigitSmall from './CounterDigitSmall.svelte';
	import clsx, { type ClassValue } from 'clsx';
	import type { Snippet } from 'svelte';

	import timesSymbol from '$lib/assets/numbers-small/times.png';

	interface Props {
		/** The number to display on the counter. */
		number: number;
		/** How much padding to apply to the display. */
		padding?: number;
		/** The height of the counter. */
		height?: string;
		/** Class names to apply. */
		class?: ClassValue;
		/** The component's children. */
		children?: Snippet;
	}

	let { number, padding = 0, height = '1rem', class: className, children }: Props = $props();

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
</script>

<div class={clsx('counter', className)} style={`--height: ${height}`}>
	<div class="digit-container">
		<img src={timesSymbol} alt="x" draggable="false" />
	</div>
	{#each digits as digitNum (digitNum)}
		<CounterDigitSmall {number} {digitNum} --height={height} />
	{/each}
	{@render children?.()}
</div>

<style>
	.counter {
		width: min-content;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;

		pointer-events: none;
	}

	.digit-container {
		width: calc(var(--height, 1rem) * 4 / 9);
		height: var(--height, 1rem);

		img {
			image-rendering: crisp-edges;
			height: 100%;
		}
	}
</style>
