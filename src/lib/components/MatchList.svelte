<script>
	import MatchListEntry from './MatchListEntry.svelte';

	/**
	 * @typedef {Object} MatchListProps
	 * @property {import('$lib/client/matches').Match[]} matches
	 * A list of matches to display.
	 * @property {string | string[]} class
	 */

	/** @type {MatchListProps} */
	let { matches, class: className } = $props();

	let tableClass = () => [className].flat().concat(['match-list']);
</script>

<table class={tableClass()}>
	<thead>
		<tr>
			<th scope="row">Score</th>
			<th scope="row"></th>
			<th scope="row"></th>
			<th scope="row"></th>
			<th scope="row"></th>
			<th scope="row"></th>
			<th scope="row">Margin Boost</th>
			<th scope="row"></th>
		</tr>
	</thead>
	<tbody>
		{#each matches as match (match.id)}
			<MatchListEntry {match} />
		{/each}
	</tbody>
</table>

<style>
	.match-list {
		border-collapse: collapse;
	}

	.match-list > thead th {
		color: var(--text-secondary);
		padding: 12px;
		font-weight: normal;

		&:first-child {
			text-align: left;
		}

		&:last-child {
			text-align: right;
		}
	}
</style>
