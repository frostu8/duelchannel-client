/**
 * The status of a map in a server's config.
 *
 * @enum {number}
 */
export const BannedStatus = {
	Blacklist: 0,
	Whitelist: 1,
	Suspect: 2
};

/**
 * A range of MMRs.
 *
 * @typedef {Object} SkillRange
 * @property {number | null} [lower] - The lower bound of the range.
 * @property {number | null} [upper] - The upper bound of the range.
 */

/**
 * A config for a specific map.
 *
 * @typedef {Object} MapConfig
 * @property {string} title - The title of the map.
 * @property {BannedStatus} status - The status of the map.
 * @property {number | null} [winCondition] - A modified wincon for the map.
 * @property {SkillRange} [skillRange] - A skill range the map config targets.
 * @property {string | null} [note] - A user-defined note.
 */

/**
 * A single server registered to the API.
 *
 * @typedef {Object} Server
 * @property {number} id - The unique ID of the server.
 * @property {string} name - The name of the server as it appears on UI. May
 *   not be the "canonical name" on the server list.
 * @property {Object<string, MapConfig>} maps - Map config, keyed by map
 *   lumpname (e.g. `RR_AUTUMNRING`).
 */

/**
 * @param {any} mapConfig
 * @returns {MapConfig}
 */
function normalizeMapConfig(mapConfig) {
	return {
		title: mapConfig['title'],
		status: mapConfig['status'],
		winCondition: mapConfig['win_condition'],
		skillRange: mapConfig['skill_range'],
		note: mapConfig['note']
	};
}

/**
 * @param {any} server
 * @returns {Server}
 */
function normalizeServer(server) {
	return {
		id: server['id'],
		name: server['name'],
		maps: Object.fromEntries(
			Object.entries(server['maps']).map(([lumpname, config]) => [
				lumpname,
				normalizeMapConfig(config)
			])
		)
	};
}

/**
 * Gets the list of servers from the API.
 *
 * @param {import('@sveltejs/kit').LoadEvent['fetch']} fetch - A fetch function.
 * @param {number} [count=50] - The number to fetch.
 * @returns {Promise<Server[]>} - The servers.
 */
export async function getServers(fetch, count = 50) {
	const res = await fetch(`/api/v1/servers?count=${count}`);
	return /** @type {any[]} */ (await res.json()).map(normalizeServer);
}
