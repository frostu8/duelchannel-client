<script>
	import { onMount } from 'svelte';
	import { getMatches } from '$lib/client/matches';
	import MatchList from '$lib/components/MatchList.svelte';
	import { createInfiniteQuery } from '@tanstack/svelte-query';

	const query = createInfiniteQuery(() => ({
		queryKey: ['matches'],
		queryFn: ({ pageParam }) => getMatches(fetch, { before: pageParam }),
		// hopefully the remote isn't in the fucking future
		initialPageParam: new Date().toISOString(),
		getNextPageParam: (/** @type {import('$lib/client/matches').Match[]} */ lastPage) => {
			if (lastPage.length > 0) {
				const lastMatch = lastPage[lastPage.length - 1];
				return lastMatch.startedAt;
			}
			return undefined;
		}
	}));

	const matches = $derived.by(() => {
		return query.data?.pages.flat();
	});

	let sentinel = $state();

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
					query.fetchNextPage();
				}
			},
			// Pre-fetch 600px before the bottom so it feels seamless
			{ rootMargin: '600px' }
		);

		if (sentinel) observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<article class="match-list">
	{#if matches != null}
		<MatchList {matches} class="match-list-inner" />
		<div class="footer" bind:this={sentinel}>
			{#if query.isFetchingNextPage}
				<h1>Loading...</h1>
			{:else}
				<h1>Load more</h1>
			{/if}
		</div>
	{/if}
</article>

<style>
	.match-list {
		max-width: 1080px;
		margin: auto;
		font-size: 1.2rem;
		overflow-y: scroll;
		height: 100%;
	}

	.footer {
		margin: auto;
		text-align: center;
		padding: 4rem 0;

		& > h1 {
			text-transform: uppercase;
		}
	}

	:global(.match-list-inner) {
		width: 100%;
	}
</style>
