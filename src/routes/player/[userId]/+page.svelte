<script lang="ts">
	import { getMatches, type Match } from '$lib/client/matches';
	import { getSinglePlayer } from '$lib/client/players';
	import MatchList from '$lib/components/MatchList.svelte';
	import PlayerProfile from '$lib/components/PlayerProfile.svelte';
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import type { PageProps } from './$types';

	const { params }: PageProps = $props();

	const userQuery = createQuery(() => ({
		queryKey: ['user', params.userId],
		queryFn: () => getSinglePlayer(fetch, params.userId)
	}));

	// Also query the matches the user has played
	const userMatchesQuery = createInfiniteQuery(() => ({
		queryKey: ['matches', { level: null, user: params.userId }],
		queryFn: ({ pageParam }) => getMatches(fetch, { before: pageParam, user: params.userId }),
		// hopefully the remote isn't in the fucking future
		initialPageParam: new Date().toISOString(),
		getNextPageParam: (lastPage: Match[]) => {
			if (lastPage.length >= 50) {
				const lastMatch = lastPage[lastPage.length - 1];
				return lastMatch.startedAt;
			}
			return undefined;
		}
	}));

	const userMatches = $derived.by(() => {
		return userMatchesQuery.data?.pages.flat().filter((match) => match.participants.length == 2);
	});

	let sentinelRef = $state<HTMLElement>();
	let sentinel = $state<HTMLElement>();
	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					userMatchesQuery.hasNextPage &&
					!userMatchesQuery.isFetchingNextPage
				) {
					userMatchesQuery.fetchNextPage();
				}
			},
			{
				root: sentinelRef,
				rootMargin: '600px'
			}
		);

		if (sentinel) observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<article bind:this={sentinelRef} class="player-summary">
	{#if userQuery.data}
		<PlayerProfile player={userQuery.data} style="margin: auto; width: 960px;" />
	{/if}
	<section class="player-match-list">
		{#if userMatches != null}
			<MatchList matches={userMatches} user={params.userId} class="player-match-list-inner" />
			<div class="footer" bind:this={sentinel}>
				{#if userMatchesQuery.isFetchingNextPage}
					<h3>Fetching more...</h3>
				{:else if userMatchesQuery.hasNextPage}
					<h3>Fetch more</h3>
				{/if}
			</div>
		{/if}
	</section>
</article>

<style>
	.player-summary {
		height: 100%;

		display: flex;
		flex-flow: column nowrap;

		overflow-y: scroll;

		:global(& .basic-stats) {
			width: 360px;
		}
	}

	.player-match-list {
		margin: auto;
		width: 960px;
	}

	.footer {
		margin: auto;
		text-align: center;
		padding: 4rem 0;
		color: var(--text-muted);
	}

	:global(.player-match-list-inner) {
		width: 100%;
	}
</style>
