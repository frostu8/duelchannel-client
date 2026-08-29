import { getPlayers } from '$lib/client/players';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const players = await getPlayers(fetch);

	return {
		players: players.filter(player => {
			return player.matchesUntilRated != null
				&& player.matchesUntilRated < 10;
		})
	};
}
