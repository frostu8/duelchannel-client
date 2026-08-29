<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname, RouteId } from '$app/types';

	/** A navbar-linkable route. Only parameterless routes are supported. */
	type AppRoute = RouteId | Pathname;
</script>

<nav class="navbar">
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
	<!-- {@render btn('Servers', '/servers')} -->
</nav>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 0 12px;
		background: var(--bg-secondary);
		border-bottom: 2px solid var(--bg-primary);
	}

	.navbar-btn {
		padding: 16px 1em;
		transform: translate(0, 2px);
		text-transform: uppercase;
		font-weight: bold;
		color: var(--text-secondary);
		text-decoration: none;
		border-bottom: 2px solid var(--bg-primary);
	}

	.navbar-btn.selected {
		color: var(--accent);
		border-color: var(--accent);
	}
</style>
