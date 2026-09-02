<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname, RouteId } from '$app/types';
	import type { Player } from '$lib/client/players';
	import PlayerSearch from './PlayerSearch.svelte';

	/** A navbar-linkable route. Only parameterless routes are supported. */
	type AppRoute = RouteId | Pathname;

	let searchText = $state('');
	function navigateUser(user: Player) {
		searchText = ''; // clear search text
		goto(resolve(`/player/${user.id}`));
	}
</script>

<nav class="navbar">
	<div class="header"></div>
	{#snippet btn(title: string, href: AppRoute)}
		<a
			href={resolve(href)}
			class={{
				['navbar-btn']: true,
				['selected']: page.url.pathname === href
			}}
		>
			{title}
		</a>
	{/snippet}
	{@render btn('Leaderboard', '/')}
	{@render btn('Duels', '/duels')}
	<!-- {@render btn('Servers', '/servers')} -->
	<div class="search-container">
		<PlayerSearch bind:text={searchText} onSelect={navigateUser} />
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 4px;
		padding: 0 12px;
		background: var(--bg-secondary);
		border-bottom: 2px solid var(--bg-primary);
	}

	.header {
		margin: 0 4em;
	}

	.navbar-btn {
		padding: 16px 1em;
		transform: translate(0, 2px);
		text-transform: uppercase;
		font-weight: bold;
		color: var(--text-secondary);
		text-decoration: none;
		border-bottom: 2px solid var(--bg-primary);

		&.selected {
			color: var(--accent);
			border-color: var(--accent);
		}
	}

	.search-container {
		flex: 1 0 auto;
		height: 100%;

		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-end;
		margin: 0 8em;
	}
</style>
