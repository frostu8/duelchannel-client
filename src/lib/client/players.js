/**
 * A player.
 *
 * @typedef {Object} Player
 * @property {string} id - The short ID of the player.
 * @property {string} display_name - The player's display name.
 * @property {string | null} avatar_url - A URL to the player's avatar.
 * @property {number | null} [dr] - The player's Duel Rating. Absent if
 * ratings are disabled server-wide; null if the player is still calibrating.
 * @property {number} flags - The player's user flags.
 * @property {number} matches_played - How many matches the player has played.
 * @property {number} win_ratio - The player's win loss ratio in `[0,1]`.
 */

/**
 * A list of players.
 *
 * @param {import('@sveltejs/kit').LoadEvent['fetch']} fetch - A fetch function.
 * @returns {Promise<Player[]>} - The players.
 */
export async function getPlayers(fetch) {
	const res = await fetch('/api/v1/players');
	const players = await res.json();

	return players;
}
