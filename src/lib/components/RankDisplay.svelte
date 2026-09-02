<script lang="ts">
	import type { Rank } from '$lib/client/players';

	import rankX from '$lib/assets/ranks/x.png';
	import rankSS from '$lib/assets/ranks/ss.png';
	import rankS from '$lib/assets/ranks/s.png';
	import rankAA from '$lib/assets/ranks/aa.png';
	import rankA from '$lib/assets/ranks/a.png';
	import rankB from '$lib/assets/ranks/b.png';
	import rankC from '$lib/assets/ranks/c.png';
	import unranked from '$lib/assets/ranks/unranked.png';

	interface Props {
		/** The rank to show. */
		rank: Rank | 'unranked';
		/** Additional styles. */
		style?: string;
	}

	let { rank, style }: Props = $props();

	const rankMap: Record<Rank | 'unranked', { src: string; alt: string }> = {
		x: { src: rankX, alt: 'X Rank' },
		ss: { src: rankSS, alt: 'SS Rank' },
		s: { src: rankS, alt: 'S Rank' },
		aa: { src: rankAA, alt: 'AA Rank' },
		a: { src: rankA, alt: 'A Rank' },
		b: { src: rankB, alt: 'B Rank' },
		c: { src: rankC, alt: 'C Rank' },
		unranked: { src: unranked, alt: 'Unranked' }
	};

	let showRank = $derived.by(() => rankMap[rank]);
</script>

<img src={showRank.src} alt={showRank.alt} title={showRank.alt} draggable="false" {style} />

<style>
	img {
		image-rendering: crisp-edges;
		height: var(--height, 1rem);
	}
</style>
