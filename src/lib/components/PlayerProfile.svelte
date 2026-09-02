<script lang="ts">
	import BadgeDisplay from './BadgeDisplay.svelte';
	import KeyValue from './KeyValue.svelte';
	import PlayerNameplate from './profile/PlayerNameplate.svelte';
	import clsx, { type ClassValue } from 'clsx';
	import PlayerOrdinal from './profile/PlayerOrdinal.svelte';
	import type { Player } from '$lib/client/players';
	import type { Snippet } from 'svelte';

	interface Props {
		/** The player to render. */
		player: Player;
		/** Whether or not to show the player's badges. */
		showBadges?: boolean;
		/** Whether or not to show the profile headers. */
		showHeader?: boolean;
		class?: ClassValue;
		style?: string;
		children?: Snippet;
	}

	const {
		player,
		showBadges = true,
		showHeader = true,
		class: className,
		style,
		children
	}: Props = $props();
</script>

<section {style} class={clsx('player-profile', className)}>
	{#if showHeader}
		<PlayerNameplate {...player} />
		{#if player.dr != null}
			<PlayerOrdinal dr={player.dr} />
		{/if}
	{/if}
	<section class="basic-stats">
		{@render children?.()}
		{#if showBadges}
			<div class="card badges">
				<h4>Badges</h4>
				<BadgeDisplay flags={player.flags} --height="2rem" />
			</div>
		{/if}
		<div class="card">
			<h4>Duel Stats</h4>
			<KeyValue key="Duels played" value={player.matchesPlayed} />
			<KeyValue key="Duels won" value={Math.floor(player.matchesPlayed * player.winRatio)} />
			<KeyValue key="Win rate" value={`${(player.winRatio * 100).toFixed(2)}%`} />
		</div>
	</section>
</section>

<style>
	.header {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 8px;

		margin: 1rem 0 0.5rem 0;

		font-size: 1.5rem;
	}

	.basic-stats {
		display: flex;
		flex-flow: column nowrap;
		align-items: stretch;
		gap: 16px;

		color: var(--text-primary);

		:global(& .card) {
			padding: 1rem;
			background-color: var(--bg-secondary);
			border-bottom: 4px solid var(--bg-primary);
		}

		:global(& .card h4) {
			color: var(--text-muted);
			text-align: center;
			text-transform: uppercase;
			margin-top: 0.6rem;

			:global(&:first-child) {
				margin: 0;
			}
		}
	}
</style>
