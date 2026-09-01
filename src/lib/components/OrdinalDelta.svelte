<script>
	/**
	 * @typedef {object} OrdinalProps
	 * @property {number} delta
	 * The delta to display.
	 */

	/** @type {OrdinalProps} */
	let { delta } = $props();

	// use a large epsilon for UI rendering
	const EPSILON = 0.01;

	const ordinalDelta = () => {
		const scoped = Math.abs(Math.floor(delta)).toLocaleString();

		if (delta >= EPSILON) {
			return `+${scoped}`;
		} else if (delta <= -EPSILON) {
			return `-${scoped}`;
		} else {
			return `±${scoped}`;
		}
	};
	const ordinalDeltaSub = () => Math.abs(Math.floor((delta - Math.trunc(delta)) * 100)).toFixed(0);
</script>

<span class="ordinal">
	{ordinalDelta()}<sub>.{ordinalDeltaSub()}</sub>
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
