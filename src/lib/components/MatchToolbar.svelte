<script lang="ts">
	import SvgIcon from '@jamescoyle/svelte-icon';
	import { mdiDownload, mdiDownloadOffOutline } from '@mdi/js';
	import type { Match } from '$lib/client/matches';

	interface Props {
		match: Match;
	}

	const { match }: Props = $props();
</script>

<div class="match-toolbar">
	{#if match.replayUrl != null}
		<a class="replay-btn" href={match.replayUrl} title="Download replay" rel="external">
			<SvgIcon type="mdi" path={mdiDownload}></SvgIcon>
		</a>
	{:else}
		<span class="disabled" title="The replay was lost or otherwise expired">
			<SvgIcon type="mdi" path={mdiDownloadOffOutline}></SvgIcon>
		</span>
	{/if}
</div>

<style>
	.match-toolbar {
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
	}

	.match-toolbar a {
		color: var(--text-primary);
		text-decoration: none;

		&:hover {
			color: white;
		}
	}

	.match-toolbar .disabled {
		color: var(--text-muted);
	}
</style>
