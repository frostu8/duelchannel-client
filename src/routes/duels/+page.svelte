<script>
	import { onMount } from 'svelte';
	import { BattleStatus, getMatches } from '$lib/client/matches';
	import MatchList from '$lib/components/MatchList.svelte';
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import Autocomplete from '@smui-extra/autocomplete';
	import { goto } from '$app/navigation';
	import { getServers } from '$lib/client/servers';

	/**
	 * @typedef {Object} Level
	 * @property {string} id
	 * @property {string} title
	 */

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	async function fetchLevels() {
		const servers = await getServers(fetch);
		return servers
			.map(server => Object.entries(server.maps)
				.map(([key, value]) => ({ id: key, ...value })))
			.flat();
	}

	/** @type {Level | null} */
	let level = $state(null);

	/**
	 * @param {string | null} [levelId]
	 */
	function navigateLevel(levelId) {
		const newParams = new URLSearchParams();

		if (levelId != null) newParams.append('level', levelId);

		goto(`?${newParams}`, {
			keepFocus: true,
			replaceState: true,
			noScroll: true,
		});
	}

	$effect(() => { if (level?.id !== data.levelId) navigateLevel(level?.id); })

	const query = createInfiniteQuery(() => ({
		queryKey: ['matches', data.levelId],
		queryFn: ({ pageParam }) =>
			getMatches(fetch, { before: pageParam, level: data.levelId, status: BattleStatus.Concluded }),
		// hopefully the remote isn't in the fucking future
		initialPageParam: new Date().toISOString(),
		getNextPageParam: (/** @type {import('$lib/client/matches').Match[]} */ lastPage) => {
			if (lastPage.length >= 50) {
				const lastMatch = lastPage[lastPage.length - 1];
				return lastMatch.startedAt;
			}
			return undefined;
		}
	}));

	const matches = $derived.by(() => {
		return query.data?.pages.flat().filter(match => match.participants.length == 2);
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

<article>
	<section class="filter-bar">
		<Autocomplete
			options={fetchLevels}
			getOptionLabel={option => option ? option.title : ''}
			bind:value={level}
			label="Level"
		/>
	</section>
	<section class="match-list">
		{#if matches != null}
			<MatchList {matches} class="match-list-inner" />
			<div class="footer" bind:this={sentinel}>
				{#if query.isFetchingNextPage}
					<h1>Loading...</h1>
				{:else if query.hasNextPage}
					<h1>Load more</h1>
				{/if}
			</div>
		{/if}
	</section>
</article>

<style>
	article {
		margin: auto;
		max-width: 1080px;
		height: 100%;

		display: flex;
		flex-flow: column nowrap;
	}

	.filter-bar {
		margin: 1em 16px;
	}

	.match-list {
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
