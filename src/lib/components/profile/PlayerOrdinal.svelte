<script lang="ts">
	import clsx, { type ClassValue } from 'clsx';
	import Ordinal from '../Ordinal.svelte';

	interface Props {
		dr: number;
		class?: ClassValue;
	}

	const { dr: ordinal, class: className }: Props = $props();
</script>

<div class={clsx('player-ordinal', className)}>
	<Ordinal {ordinal} />
	<span class="suffix">DR</span>
</div>

<style>
	.player-ordinal {
		display: flex;
		flex-flow: row nowrap;
		align-items: baseline;
		font-size: 1.8rem;

		margin-bottom: 1rem;
		color: var(--text-muted);

		& .suffix {
			margin: 0 1rem;
		}
	}
</style>
