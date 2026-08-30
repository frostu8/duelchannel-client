import { getMatches } from '$lib/client/matches';
import { noop } from '@tanstack/svelte-query';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, parent }) {
	const { queryClient } = await parent();

	await queryClient
		.infiniteQuery({
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
		})
		.catch(noop);
}
