import { getSingleMatch } from '$lib/client/matches';
import { noop } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { queryClient } = await parent();
	const matchId = params.matchId;

	await queryClient
		.query({
			queryKey: ['match', matchId],
			queryFn: () => getSingleMatch(fetch, matchId)
		})
		.catch(noop);
};
