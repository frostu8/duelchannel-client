<script>
	import MatchListEntry from './MatchListEntry.svelte';

	/**
	 * @typedef {Object} MatchListProps
	 * @property {import('$lib/client/matches').Match[]} matches
	 * A list of matches to display.
	 * @property {string | null} [user]
	 * The user to filter by. This will also arrange participant lists so that
	 * the user comes first in the list.
	 * @property {string | string[]} class
	 */

	/** @type {MatchListProps} */
	let {
		matches,
		user,
		class: className,
	} = $props();

	let showOpponentOnly = $derived(user != null);

	let tableClass = () => [className].flat().concat(['match-list']);

	/**
	 * @param {import('$lib/client/matches').Participant} a
	 * @param {import('$lib/client/matches').Participant} b
	 */
	let compareFn = (a, b) => {
		if (a.user.id === user) {
			return -1;
		} else if (b.user.id === user){
			return 1;
		} else {
			return 0;
		}
	};

	/**
	 * @typedef {"victory" | "defeat"} MatchOutcome
	 */

	/**
	 * @typedef {import('$lib/client/matches').Match & { outcome?: MatchOutcome }} MatchWithOutcome
	 */

	/**
	 * @returns {MatchWithOutcome[]}
	 */
	const matchesFiltered = () => {
		if (user != null) {
			return matches
				.filter(match => match.participants.some(p => p.user.id === user))
				// push the player to the top of the list
				.map(match => ({ ...match, participants: match.participants.sort(compareFn) }))
				.map(match => {
					// Add an additional property, "result," to the match.
					// From the filter above, we know that the first participant is
					// always the player we are inspecting.
					const me = match.participants[0];

					if (me.noContest) {
						return { ...match, outcome: "defeat" };
					} else {
						return { ...match, outcome: "victory" };
					}
				});
		} else {
			return matches;
		}
	};
</script>

<table class={tableClass()}>
	<thead>
		<tr>
			<th scope="row" title="The score the players finished with">Score</th>
			<th
				scope="row"
				colspan={user != null ? 2 : 3}
			></th>
			<th scope="row"></th>
			<th scope="row" title="The total duel time">Time</th>
			<th scope="row" title="The final margin boost of the battle">M.Boost</th>
			{#if showOpponentOnly}
				<th scope="row" title="DR gain/loss">Gain/Loss</th>
			{/if}
			<th scope="row"></th>
		</tr>
	</thead>
	<tbody>
		{#each matchesFiltered() as match (match.id)}
			<MatchListEntry
				{match}
				outcome={match.outcome}
				{showOpponentOnly}
			/>
		{/each}
	</tbody>
</table>

<style>
	.match-list {
		border-collapse: collapse;
	}

	.match-list > thead th {
		/* Pin header to top */
		position: sticky;
		top: 0;
		z-index: 10; /* This has to be >5 to account for the margin boost icons */

		background-color: var(--bg-base);
		color: var(--text-secondary);
		padding: 12px;

		font-size: 1rem;
		font-weight: normal;

		&:first-child {
			text-align: left;
		}

		&:last-child {
			text-align: right;
		}
	}
</style>
