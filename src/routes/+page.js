import { getPlayers } from '$lib/client/players';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	return {
		players: await getPlayers(fetch)
	};
}
