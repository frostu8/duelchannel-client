/** @typedef {"x" | "ss" | "s" | "aa" | "a" | "b" | "c"} Rank */

/**
 * A player.
 *
 * @typedef {Object} Player
 * @property {string} id - The short ID of the player.
 * @property {string} displayName - The player's display name.
 * @property {string | null} avatarUrl - A URL to the player's avatar.
 * @property {number | null} [dr] - The player's Duel Rating. Absent if
 * ratings are disabled server-wide; null if the player is still calibrating.
 * @property {Rank | null} [rank] - The player's rank.
 * @property {number} flags - The player's user flags.
 * @property {number} matchesPlayed - How many matches the player has played.
 * @property {number} winRatio - The player's win loss ratio in `[0,1]`.
 * @property {number} [matchesUntilRated]
 * How many matches the players needs to play until being rated.
 */

/**
 * @param {any} player
 * @returns {Player}
 */
function normalizePlayer(player) {
  return {
    id: player["id"],
    displayName: player["display_name"],
    avatarUrl: player["avatar_url"],
    dr: player["dr"],
    rank: player["rank"],
    flags: player["flags"],
    matchesPlayed: player["matches_played"],
    winRatio: player["win_ratio"],
    matchesUntilRated: player["matches_until_rated"],
  };
}

/**
 * A list of players.
 *
 * @param {import('@sveltejs/kit').LoadEvent['fetch']} fetch - A fetch function.
 * @param {number} [count=50] - The number to fetch.
 * @returns {Promise<Player[]>} - The players.
 */
export async function getPlayers(fetch, count = 50) {
	const res = await fetch(`/api/v1/players?count=${count}`);
	return /** @type {any[]} */ (await res.json()).map(normalizePlayer);
}
