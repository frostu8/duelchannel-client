import { getPlayers } from '$lib/client/players';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const players = await getPlayers(fetch);

	return {
		players: players.filter((player) => {
			return player.matchesUntilRated != null && player.matchesUntilRated < 10;
		})
	};
};
