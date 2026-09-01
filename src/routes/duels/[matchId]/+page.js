import { getSingleMatch } from '$lib/client/matches';
import { noop } from '@tanstack/svelte-query';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, parent }) {
  const { queryClient } = await parent();
  const matchId = params.matchId;

  await queryClient
    .query({
      queryKey: ['match', matchId],
      queryFn: () => getSingleMatch(fetch, matchId),
    })
    .catch(noop);
}
