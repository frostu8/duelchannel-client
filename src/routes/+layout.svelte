<script lang="ts">
	import NavigationBar from '$lib/components/NavigationBar.svelte';
	import favicon from '$lib/assets/favicon.png';
	import '../app.scss';

	import { QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon} />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<div class="app-container">
		<NavigationBar />
		<main class="main">
			{@render children()}
		</main>
	</div>
</QueryClientProvider>

<style>
	.app-container {
		display: flex;
		flex-flow: column nowrap;
		height: 100%;
	}

	.main {
		flex: 0 1 auto;
		width: 100%;
		min-height: 0;
	}
</style>
