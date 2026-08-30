<script>
	import { onMount } from 'svelte';
	import { BattleStatus, getMatches } from '$lib/client/matches';
	import MatchList from '$lib/components/MatchList.svelte';
	import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
	import Autocomplete from '@smui-extra/autocomplete';
	import { goto } from '$app/navigation';
	import { getServers } from '$lib/client/servers';
	import { mdiCube } from '@mdi/js';
	import SvgIcon from '@jamescoyle/svelte-icon';
	import Textfield from '@smui/textfield';

	/**
	 * @typedef {Object} Level
	 * @property {string} id
	 * @property {string} title
	 */

	/** @type {import('./$types').PageProps} */
	let { data } = $props();

	/** @type {Level[] | null} */
	let levels = $state(null);
	/** @type {string} */
	let levelQuery = $state('');

	async function fetchLevels() {
		const servers = await getServers(fetch);
		return servers
			.map(server => Object.entries(server.maps)
				.map(([key, value]) => ({ id: key, ...value })))
			.flat()
			.sort((a, b) => a.title.localeCompare(b.title));
	}

	/**
	 * @param {Level | null} [level]
	 */
	function navigateLevel(level) {
		const newParams = new URLSearchParams();

		if (level?.id != null) newParams.append('level', level.id);

		goto(`?${newParams}`, {
			keepFocus: true,
			replaceState: true,
			noScroll: true,
		});
	}

	const query = createInfiniteQuery(() => ({
		queryKey: ['matches', { level: data.levelId, user: null }],
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

	onMount(async () => {
		// Fetch levels async
		levels = await fetchLevels();
	});

	let list = $state();
	let sentinel = $state();
	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
					query.fetchNextPage();
				}
			},
			// Pre-fetch 600px before the bottom so it feels seamless
			{
				root: list,
				rootMargin: '600px',
			},
		);

		if (sentinel) observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<article>
	<section class="filter-bar">
		<Autocomplete
			options={levels ?? []}
			bind:text={levelQuery}
			getOptionLabel={option => option ? option.title : ''}
			onSMUIAutocompleteSelected={ev => navigateLevel(ev.detail)}
			onSMUIAutocompleteDeselected={() => navigateLevel(null)}
			style="width: 24rem;"
		>
			<Textfield
				label="Level"
				bind:value={levelQuery}
		    style="width: 24rem;"
			>
				{#snippet leadingIcon()}
	        <SvgIcon size={24} type="mdi" path={mdiCube} class="mdc-text-field__icon mdc-text-field__icon--leading material-icons" />
	      {/snippet}
			</Textfield>
		</Autocomplete>
	</section>
	<section class="match-list" bind:this={list}>
		{#if matches != null}
			<MatchList {matches} class="match-list-inner" />
			<div class="footer" bind:this={sentinel}>
				{#if query.isFetchingNextPage}
					<h3>Fetching more...</h3>
				{:else if query.hasNextPage}
					<h3>Fetch more</h3>
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
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 18px;

		margin: 1rem 0 1rem 2.5rem;
	}

	:global(.filter-bar svg) {
		color: var(--text-muted);
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
		color: var(--text-muted);
	}

	:global(.match-list-inner) {
		width: 100%;
	}

	:global(.filter-bar .mdc-menu-surface) {
    z-index: 20;
  }
</style>
