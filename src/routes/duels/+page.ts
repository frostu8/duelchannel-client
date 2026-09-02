import { getMatches, type Match } from '$lib/client/matches';
import { noop } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent, url }) => {
	const { queryClient } = await parent();

	const levelId = url.searchParams.get('level');

	await queryClient
		.infiniteQuery({
			queryKey: ['matches', { level: levelId, user: null }],
			queryFn: ({ pageParam }) => getMatches(fetch, { before: pageParam, level: levelId }),
			// hopefully the remote isn't in the fucking future
			initialPageParam: new Date().toISOString(),
			getNextPageParam: (lastPage: Match[]) => {
				if (lastPage.length > 0) {
					const lastMatch = lastPage[lastPage.length - 1];
					return lastMatch.startedAt;
				}
				return undefined;
			}
		})
		.catch(noop);

	return { levelId };
};
