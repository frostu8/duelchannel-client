import type { LoadEvent } from '@sveltejs/kit';
import { normalizePlayer, type Player } from '$lib/client/players';

/**
 * The match's status.
 */
export const BattleStatus = {
	Ongoing: 0,
	Concluded: 1,
	Cancelled: 2
} as const;

export type BattleStatus = (typeof BattleStatus)[keyof typeof BattleStatus];

/**
 * A kart item.
 */
export type KartItem =
	| 'sneaker'
	| 'rocket_sneaker'
	| 'invincibility'
	| 'banana'
	| 'eggman'
	| 'orbinaut'
	| 'jawz'
	| 'proximity_mine'
	| 'landmine'
	| 'ballhog'
	| 'spb'
	| 'grow'
	| 'shrink'
	| 'lightning_shield'
	| 'bubble_shield'
	| 'flame_shield'
	| 'hyudoro'
	| 'pogo_spring'
	| 'super_ring'
	| 'kitchen_sink'
	| 'drop_target'
	| 'garden_top'
	| 'gachabom'
	| 'stone_shoe'
	| 'toxomister';

/**
 * A description for a single item pull.
 */
export interface ItemUsage {
	/** The base item this struct represents. */
	item: KartItem;
	/** The size of the stack when this was pulled from the roulette. */
	stack: number;
	/** How many times the item was pulled from a roulette. */
	count: number;
}

/**
 * A character a player might play as.
 */
export interface Skin {
	/** The internal name of the character. */
	name: string;
	/** The human-readable name of the character. */
	realName: string;
	/** The speed of the character. */
	kartSpeed: number;
	/** The weight of the character. */
	kartWeight: number;
}

/**
 * A participant in a match.
 */
export interface Participant {
	/** The name of the player. */
	name: string;
	/** The team they are on (`0` = red / player 1, `1` = blue / player 2). */
	team: number;
	/** The player's score. For duels, this is how many checkpoints the player crossed. */
	score: number;
	/**
	 * The player's DR at the time of match creation. If the player is
	 * provisional, this will be `null`. Absent for pre-season matches.
	 */
	dr?: number | null;
	/**
	 * The change in the player's DR once the match concluded. If the player is
	 * proivisonal, this will be null. Absent until the match is rated.
	 */
	drDelta?: number | null;
	/** The item usage of the player in the match. */
	roulette: ItemUsage[];
	/** The user participating. */
	user: Player;
	/** The player's finish time, if they finished. */
	finishTime?: number | null;
	/** If the player no contest'd. */
	noContest?: boolean;
	/** The player's skin. */
	skin?: Skin | null;
	/** The internal name of the player's skin color. */
	skinColor?: string | null;
}

/**
 * A match.
 */
export interface Match {
	/** The unique identifier of the match. */
	id: string;
	/** The level's internal identifier (the map lumpname, e.g. `RR_AUTUMNRING`). */
	levelId: string;
	/** The level name the match played on. */
	levelName: string;
	/** The status of the match. */
	status: BattleStatus;
	/** `true` if the match contributes to the user's rating. */
	rated: boolean;
	/**
	 * The margin score of the match. This is the number of margin boosts the
	 * match had. This is typically zero, and goes up steadily after 3 minutes
	 * of playtime.
	 */
	marginScore: number;
	/** When the match started, as an ISO 8601 date-time string. */
	startedAt: string;
	/** The participants. */
	participants: Participant[];
	/** A link to the replay associated with the match. */
	replayUrl?: string | null;
}

/** The ticrate the game runs at. */
export const TICRATE: number = 35;

/** Converts tics to minutes. */
function ticsToMinutes(tics: number): number {
	return Math.floor(tics / (60 * TICRATE));
}

/** Converts tics to seconds. */
function ticsToSeconds(tics: number): number {
	return Math.floor((tics / TICRATE) % 60);
}

/** Converts tics to centiseconds. */
function ticsToCentiseconds(tics: number): number {
	return Math.floor((tics % TICRATE) * (100 / TICRATE));
}

/** Displays a match's finish time as a formatted string */
export function formatFinishTime(match: Match): string | undefined {
	const participants = match.participants.map((p) => p.finishTime).filter((p) => p != null);

	if (participants.length === 0) return;
	const timeTics = participants.reduce((acc, x) => {
		if (acc < x) {
			return acc;
		} else {
			return x;
		}
	});

	if (timeTics != null) {
		const minutes = ticsToMinutes(timeTics).toString().padStart(2, '0');
		const seconds = ticsToSeconds(timeTics).toString().padStart(2, '0');
		const centiSeconds = ticsToCentiseconds(timeTics).toString().padStart(2, '0');

		return `${minutes}'${seconds}"${centiSeconds}`;
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeItemUsage(itemUsage: any): ItemUsage {
	return {
		item: itemUsage['item'],
		stack: itemUsage['stack'],
		count: itemUsage['count']
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSkin(skin: any): Skin | null {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeParticipant(participant: any): Participant {
	return {
		name: participant['name'],
		team: participant['team'],
		score: participant['score'],
		dr: participant['dr'],
		drDelta: participant['dr_delta'],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		roulette: (participant['roulette'] as any[]).map(normalizeItemUsage),
		user: normalizePlayer(participant['user']),
		finishTime: participant['finish_time'],
		noContest: participant['no_contest'],
		skin: normalizeSkin(participant['skin']),
		skinColor: participant['skin_color']
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeMatch(match: any): Match {
	return {
		id: match['id'],
		levelId: match['level_id'],
		levelName: match['level_name'],
		status: match['status'],
		rated: match['rated'],
		marginScore: match['margin_score'],
		startedAt: match['started_at'],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		participants: (match['participants'] as any[]).map(normalizeParticipant),
		replayUrl: match['replay_url']
	};
}

/**
 * Fetches a single match from the API by id.
 */
export async function getSingleMatch(fetch: LoadEvent['fetch'], id: string): Promise<Match> {
	const res = await fetch(`/api/v1/matches/${encodeURIComponent(id)}`);
	return normalizeMatch(await res.json());
}

export interface GetMatchesOptions {
	/** Page size. */
	count?: number;
	/** Only return matches started before this timestamp. */
	before?: string | null;
	/** The id of the level to filter by. */
	level?: string | null;
	/** The id of the user to filter by. */
	user?: string | null;
	/** Show normally hidden ongoing matches. */
	showOngoing?: BattleStatus | null;
}

/**
 * Gets the list of matches from the API.
 */
export async function getMatches(
	fetch: LoadEvent['fetch'],
	{ count, before, level, user, showOngoing }: GetMatchesOptions = {}
): Promise<Match[]> {
	const query = new URLSearchParams();

	if (count != null) query.append('count', count.toString());
	if (before != null) query.append('before', before);
	if (level != null) query.append('level', level);
	if (user != null) query.append('user', user);
	if (showOngoing != null) query.append('show_ongoing', showOngoing.toString());

	const res = await fetch(`/api/v1/matches?${query}`);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return ((await res.json()) as any[]).map(normalizeMatch);
}
