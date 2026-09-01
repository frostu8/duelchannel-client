import { normalizePlayer } from '$lib/client/players';

/**
 * The match's status.
 *
 * @enum {number}
 */
export const BattleStatus = {
	Ongoing: 0,
	Concluded: 1,
	Cancelled: 2
};

/**
 * A kart item.
 *
 * @typedef {"sneaker" | "rocket_sneaker" | "invincibility" | "banana" |
 *   "eggman" | "orbinaut" | "jawz" | "proximity_mine" | "landmine" |
 *   "ballhog" | "spb" | "grow" | "shrink" | "lightning_shield" |
 *   "bubble_shield" | "flame_shield" | "hyudoro" | "pogo_spring" |
 *   "super_ring" | "kitchen_sink" | "drop_target" | "garden_top" |
 *   "gachabom" | "stone_shoe" | "toxomister"} KartItem
 */

/**
 * A description for a single item pull.
 *
 * @typedef {Object} ItemUsage
 * @property {KartItem} item - The base item this struct represents.
 * @property {number} stack - The size of the stack when this was pulled
 *   from the roulette.
 * @property {number} count - How many times the item was pulled from a
 *   roulette.
 */

/**
 * A character a player might play as.
 *
 * @typedef {Object} Skin
 * @property {string} name - The internal name of the character.
 * @property {string} realName - The human-readable name of the character.
 * @property {number} kartSpeed - The speed of the character.
 * @property {number} kartWeight - The weight of the character.
 */

/**
 * A match.
 *
 * @typedef {Object} Match
 * @property {string} id - The unique identifier of the match.
 * @property {string} levelId - The level's internal identifier (the map
 *   lumpname, e.g. `RR_AUTUMNRING`).
 * @property {string} levelName - The level name the match played on.
 * @property {BattleStatus} status - The status of the match.
 * @property {number} marginScore - The margin score of the match. This is
 *   the number of margin boosts the match had. This is typically zero, and
 *   goes up steadily after 3 minutes of playtime.
 * @property {string} startedAt - When the match started, as an ISO 8601
 *   date-time string.
 * @property {Participant[]} participants - The participants.
 * @property {string | null} [replayUrl] - A link to the replay associated
 *   with the match.
 */

/**
 * A participant in a match.
 *
 * @typedef {Object} Participant
 * @property {string} name - The name of the player.
 * @property {number} team - The team they are on (`0` = red / player 1,
 *   `1` = blue / player 2).
 * @property {number} score - The player's score. For duels, this is how
 *   many checkpoints the player crossed.
 * @property {number | null} [dr] - The player's DR at the time of match
 *   creation. If the player is provisional, this will be `null`. Absent for
 *   pre-season matches.
 * @property {number | null} [drDelta] - The change in the player's DR once the
 *   match concluded. If the player is proivisonal, this will be null. Absent
 *   until the match is rated.
 * @property {ItemUsage[]} roulette - The item usage of the player in the
 *   match.
 * @property {import('$lib/client/players').Player} user - The user
 *   participating.
 * @property {number | null} [finishTime] - The player's finish time, if
 *   they finished.
 * @property {boolean} [noContest] - If the player no contest'd.
 * @property {Skin | null} [skin] - The player's skin.
 * @property {string | null} [skinColor] - The internal name of the player's
 *   skin color.
 */

/**
 * @param {any} itemUsage
 * @returns {ItemUsage}
 */
function normalizeItemUsage(itemUsage) {
	return {
		item: itemUsage['item'],
		stack: itemUsage['stack'],
		count: itemUsage['count']
	};
}

/**
 * @param {any} skin
 * @returns {Skin | null}
 */
function normalizeSkin(skin) {
	if (skin == null) {
		return skin;
	}
	return {
		name: skin['name'],
		realName: skin['real_name'],
		kartSpeed: skin['kart_speed'],
		kartWeight: skin['kart_weight']
	};
}

/**
 * @param {any} participant
 * @returns {Participant}
 */
function normalizeParticipant(participant) {
	return {
		name: participant['name'],
		team: participant['team'],
		score: participant['score'],
		dr: participant['dr'],
		drDelta: participant['dr_delta'],
		roulette: /** @type {any[]} */ (participant['roulette']).map(normalizeItemUsage),
		user: normalizePlayer(participant['user']),
		finishTime: participant['finish_time'],
		noContest: participant['no_contest'],
		skin: normalizeSkin(participant['skin']),
		skinColor: participant['skin_color']
	};
}

/**
 * @param {any} match
 * @returns {Match}
 */
function normalizeMatch(match) {
	return {
		id: match['id'],
		levelId: match['level_id'],
		levelName: match['level_name'],
		status: match['status'],
		marginScore: match['margin_score'],
		startedAt: match['started_at'],
		participants: /** @type {any[]} */ (match['participants']).map(normalizeParticipant),
		replayUrl: match['replay_url']
	};
}

/**
 * Gets the list of matches from the API.
 *
 * @param {import('@sveltejs/kit').LoadEvent['fetch']} fetch - A fetch function.
 * @param {object} [options]
 * @param {number} [options.count] - Page size.
 * @param {string | null} [options.before] - Only return matches started before
 * this timestamp.
 * @param {string | null} [options.level] - The id of the level to filter by.
 * @param {string | null} [options.user] - The id of the user to filter by.
 * @param {BattleStatus | null} [options.showOngoing]
 *   Show normally hidden ongoing matches.
 * @returns {Promise<Match[]>} - The matches.
 */
export async function getMatches(fetch, { count, before, level, user, showOngoing } = {}) {
	const query = new URLSearchParams();

	if (count != null) query.append('count', count.toString());
	if (before != null) query.append('before', before);
	if (level != null) query.append('level', level);
	if (user != null) query.append('user', user);
	if (showOngoing != null) query.append('show_ongoing', showOngoing.toString());

	const res = await fetch(`/api/v1/matches?${query}`);
	return /** @type {any[]} */ (await res.json()).map(normalizeMatch);
}
