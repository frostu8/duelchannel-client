<script lang="ts">
	interface Props {
		/** The ordinal to display. */
		ordinal: number;
	}

	let { ordinal }: Props = $props();

	let ordinalDisplay = () => (ordinal != null ? Math.floor(ordinal).toLocaleString() : null);
	let ordinalDisplaySub = () =>
		ordinal != null
			? '.' + ((ordinal - Math.trunc(ordinal)) * 100).toFixed(0).padStart(2, '0')
			: null;
</script>

<span class="ordinal">
	{ordinalDisplay()}<sub>{ordinalDisplaySub()}</sub>
</span>

<style>
	.ordinal {
		font-weight: bold;
		color: var(--ordinal-color, var(--text-primary));
	}

	.ordinal > sub {
		color: var(--ordinal-sub-color, var(--text-secondary));
		font-size: 0.7em;
		vertical-align: baseline;
	}
</style>
