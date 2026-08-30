import { BattleStatus, getMatches } from '$lib/client/matches';
import { noop } from '@tanstack/svelte-query';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent, url }) {
	const { queryClient } = await parent();

	const levelId = url.searchParams.get('level');

	await queryClient
		.infiniteQuery({
			queryKey: ['matches', { level: levelId, user: null }],
			queryFn: ({ pageParam }) =>
				getMatches(fetch, { before: pageParam, level: levelId, status: BattleStatus.Concluded }),
			// hopefully the remote isn't in the fucking future
			initialPageParam: new Date().toISOString(),
			getNextPageParam: (/** @type {import('$lib/client/matches').Match[]} */ lastPage) => {
				if (lastPage.length > 0) {
					const lastMatch = lastPage[lastPage.length - 1];
					return lastMatch.startedAt;
				}
				return undefined;
			}
		})
		.catch(noop);

	return { levelId };
}
