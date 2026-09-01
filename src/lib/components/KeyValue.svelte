<script>
  /**
   * @typedef {Object} KeyValueProps
   * @property {string} key
   * @property {Object} [value]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {KeyValueProps} */
  const { key, value, children } = $props();
  const valueString = () => value?.toString();
</script>

<div class="key-value">
  <p>{key}</p>
  <div></div>
  {#if children != null}
  	{@render children()}
  {:else}
	  <h1>{valueString()}</h1>
  {/if}
</div>

<style>
	.key-value{
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-end;
		align-items: center;
		margin-top: 0.1em;

		& > p {
			color: var(--text-secondary);
			text-transform: uppercase;
		}
		& > h1 {
			font-size: inherit;
			font-weight: bold;
		}
		& > div {
			/* Styling for divider */
			border-bottom: 2px dotted var(--text-muted);
			margin: 0 0.5em;
			flex: 1 0 auto;
		}
	}
</style>
