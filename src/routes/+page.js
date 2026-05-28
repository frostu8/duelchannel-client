/** @type {import('$types').PageLoad} */
export const load = async ({ fetch, params }) => {
  const res = await fetch('/api/v1/players');
  const players = await res.json();

  return { players };
};
