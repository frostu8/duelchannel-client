import type { LoadEvent } from '@sveltejs/kit';

export type Rank = 'x' | 'ss' | 's' | 'aa' | 'a' | 'b' | 'c';

/**
 * A player.
 */
export interface Player {
	/** The short ID of the player. */
	id: string;
	/** The player's display name. */
	displayName: string;
	/** A URL to the player's avatar. */
	avatarUrl: string | null;
	/**
	 * The player's Duel Rating. Absent if ratings are disabled server-wide;
	 * null if the player is still calibrating.
	 */
	dr?: number | null;
	/** The player's rank. */
	rank?: Rank | null;
	/** The player's user flags. */
	flags: number;
	/** How many matches the player has played. */
	matchesPlayed: number;
	/** The player's win loss ratio in `[0,1]`. */
	winRatio: number;
	/** How many matches the players needs to play until being rated. */
	matchesUntilRated?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizePlayer(player: any): Player {
	return {
		id: player['id'],
		displayName: player['display_name'],
		avatarUrl: player['avatar_url'],
		dr: player['dr'],
		rank: player['rank'],
		flags: player['flags'],
		matchesPlayed: player['matches_played'],
		winRatio: player['win_ratio'],
		matchesUntilRated: player['matches_until_rated']
	};
}

/**
 * Fetches a specific player.
 */
export async function getSinglePlayer(fetch: LoadEvent['fetch'], userId: string): Promise<Player> {
	const res = await fetch(`/api/v1/players/${userId}`);
	return normalizePlayer(await res.json());
}

export interface GetPlayersOptions {
	/** The search term to filter users by. */
	search?: string;
	/** How many players to return. */
	count?: number;
}

/**
 * Fetches a list of players sorted by DR.
 */
export async function getPlayers(
	fetch: LoadEvent['fetch'],
	options: GetPlayersOptions = {}
): Promise<Player[]> {
	// Normalize query stuff
	const query = new URLSearchParams(
		Object.fromEntries(
			Object.entries(options)
				.filter(([, val]) => val != null)
				.map(([key, val]) => [key, val.toString()])
		)
	);

	const res = await fetch(`/api/v1/players?${query}`);
	return (await res.json()).map(normalizePlayer) as Player[];
}
