/**
 * User flags.
 * @readonly
 * @enum {number}
 */
const UserFlags = {
	ADMINISTRATOR: 1,
	BETA_TESTER: 1 << 1,
	BETA_CHALLENGER: 1 << 2
};

/**
 * @returns {Array<UserFlags>} - All flags
 */
export function all() {
	return Object.values(UserFlags);
}

/**
 * Decode a user flags bitmask into flag names.
 *
 * @param {number} flags - The raw bitmask.
 * @returns {Array<keyof typeof UserFlags>} - Names of the set flags.
 */
export function decode(flags) {
	return /** @type {Array<keyof typeof UserFlags>} */ (
		Object.entries(UserFlags)
			.filter(([, bit]) => flags & bit)
			.map(([name]) => name)
	);
}

export default UserFlags;
