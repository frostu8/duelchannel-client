<script lang="ts">
	import clsx, { type ClassValue } from 'clsx';
	import RankDisplay from '../RankDisplay.svelte';
	import type { Rank } from '$lib/client/players';
	import { resolve } from '$app/paths';

	interface Props {
		id: string;
		rank?: Rank | null;
		displayName: string;
		class?: ClassValue;
	}

	const { id, rank, displayName, class: className }: Props = $props();
</script>

<div class={clsx('player-nameplate', className)}>
	{#if rank != null}
		<RankDisplay {rank} --height="2.5em" />
	{/if}
	<h1><a href={resolve(`/player/${id}`)}>{displayName}</a></h1>
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
