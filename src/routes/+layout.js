import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

/** @type {import('./$types').LayoutLoad} */
export async function load() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	return { queryClient };
}
