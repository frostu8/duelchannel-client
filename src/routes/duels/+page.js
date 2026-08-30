import { getMatches } from '$lib/client/matches';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const matches = await getMatches(fetch);
  return { matches };
}
