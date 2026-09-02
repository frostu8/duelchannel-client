import type { LoadEvent } from '@sveltejs/kit';

/**
 * The status of a map in a server's config.
 */
export const BannedStatus = {
	Blacklist: 0,
	Whitelist: 1,
	Suspect: 2
} as const;

export type BannedStatus = (typeof BannedStatus)[keyof typeof BannedStatus];

/**
 * A range of MMRs.
 */
export interface SkillRange {
	/** The lower bound of the range. */
	lower?: number | null;
	/** The upper bound of the range. */
	upper?: number | null;
}

/**
 * A config for a specific map.
 */
export interface MapConfig {
	/** The title of the map. */
	title: string;
	/** The status of the map. */
	status: BannedStatus;
	/** A modified wincon for the map. */
	winCondition?: number | null;
	/** A skill range the map config targets. */
	skillRange?: SkillRange;
	/** A user-defined note. */
	note?: string | null;
}

/**
 * A single server registered to the API.
 */
export interface Server {
	/** The unique ID of the server. */
	id: number;
	/**
	 * The name of the server as it appears on UI. May not be the "canonical
	 * name" on the server list.
	 */
	name: string;
	/** Map config, keyed by map lumpname (e.g. `RR_AUTUMNRING`). */
	maps: Record<string, MapConfig>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMapConfig(mapConfig: any): MapConfig {
	return {
		title: mapConfig['title'],
		status: mapConfig['status'],
		winCondition: mapConfig['win_condition'],
		skillRange: mapConfig['skill_range'],
		note: mapConfig['note']
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeServer(server: any): Server {
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
 */
export async function getServers(fetch: LoadEvent['fetch'], count = 50): Promise<Server[]> {
	const res = await fetch(`/api/v1/servers?count=${count}`);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return ((await res.json()) as any[]).map(normalizeServer);
}
