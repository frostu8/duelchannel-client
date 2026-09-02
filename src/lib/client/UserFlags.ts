/**
 * User flags.
 */
export const UserFlags = {
	ADMINISTRATOR: 1,
	BETA_TESTER: 1 << 1,
	BETA_CHALLENGER: 1 << 2
} as const;

export type UserFlags = (typeof UserFlags)[keyof typeof UserFlags];

/**
 * Returns all flags.
 */
export function all(): UserFlags[] {
	return Object.values(UserFlags);
}

/**
 * Decode a user flags bitmask into flag names.
 */
export function decode(flags: number): Array<keyof typeof UserFlags> {
	return Object.entries(UserFlags)
		.filter(([, bit]) => flags & bit)
		.map(([name]) => name) as Array<keyof typeof UserFlags>;
}

export default UserFlags;
