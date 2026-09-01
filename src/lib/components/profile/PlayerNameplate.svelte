<script>
	import clsx from 'clsx';
	import RankDisplay from '../RankDisplay.svelte';

	/**
	 * @typedef {object} PlayerNameplateProps
	 * @property {string} id
	 * @property {import('$lib/client/players').Rank | null} [rank]
	 * @property {string} displayName
	 * @property {import('clsx').ClassValue} [class]
	 */

	/** @type {PlayerNameplateProps} */
	const { id, rank, displayName, class: className } = $props();
</script>

<div class={clsx("player-nameplate", className)}>
	{#if rank != null}
		<RankDisplay rank={rank} --height="2.5em" />
	{/if}
	<h1><a href="/player/{id}">{displayName}</a></h1>
</div>

<style>
	.player-nameplate {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 8px;

		margin: 1rem 0 0.5rem 0;
		font-size: 1.5rem;

		a {
			color: var(--text-secondary);
			font-weight: bold;
			text-decoration: none;
			&:hover {
				color: white;
			}
		}

		& > h1 {
			text-transform: uppercase;
		}
	}
</style>
