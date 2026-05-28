/**
 * User flags.
 * @readonly
 * @enum {number}
 */
const UserFlags = {
  ADMINISTARTOR: 1,
  BETA_TESTER: 1 << 1,
  BETA_CHALLENGER: 1 << 2,
};

/**
 * @returns {Array<UserFlags>} - All flags
 */
export function all() {
  return Object.values(UserFlags);
}

export default UserFlags;
