<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	/**
	 * @typedef {import('$app/types').RouteId | import('$app/types').Pathname} AppRoute
	 */
</script>

<nav class="dc-navbar">
	{#snippet btn(/** @type {string} */ title, /** @type {AppRoute} */ href)}
		<a
			href={resolve(/** @type {any} */ (href))}
			class={{
				['navbar-btn']: true,
				['selected']: page.url.pathname === href
			}}
		>
			{title}
		</a>
	{/snippet}
	{@render btn('Players', '/')}
	{@render btn('Servers', '/servers')}
</nav>

<style>
	.dc-navbar {
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
		color: var(--text-secondary);
		text-decoration: none;
		border-bottom: 2px solid var(--bg-primary);
	}

	.navbar-btn.selected {
		color: var(--accent);
		border-color: var(--accent);
	}
</style>
