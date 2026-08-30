import { BattleStatus, getMatches } from '$lib/client/matches';
import { getSinglePlayer } from '$lib/client/players';
import { noop } from '@tanstack/svelte-query';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, parent }) {
  const { queryClient } = await parent();
  const userId = params.userId;

  await queryClient
    .query({
      queryKey: ['user', userId],
      queryFn: () => getSinglePlayer(fetch, userId),
    })
    .catch(noop);

  await queryClient
    .infiniteQuery({
  		queryKey: ['matches', { level: null, user: userId }],
  		queryFn: ({ pageParam }) =>
  			getMatches(fetch, { before: pageParam, user: userId, status: BattleStatus.Concluded }),
  		// hopefully the remote isn't in the fucking future
  		initialPageParam: new Date().toISOString(),
  		getNextPageParam: (/** @type {import('$lib/client/matches').Match[]} */ lastPage) => {
  			if (lastPage.length >= 50) {
  				const lastMatch = lastPage[lastPage.length - 1];
  				return lastMatch.startedAt;
  			}
  			return undefined;
  		}
    })
    .catch(noop);
}
