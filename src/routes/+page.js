/** @import {PageLoad} from './$types' */

/** @type {PageLoad} */
export async function load({ fetch }) {
  const res = await fetch('/api/v1/players');
  const players = await res.json();

  return { players };
};
