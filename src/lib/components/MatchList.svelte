<script lang="ts">
	import { type Match, type Participant } from '$lib/client/matches';
	import MatchListEntry from './MatchListEntry.svelte';

	type MatchOutcome = 'victory' | 'defeat' | 'no_contest';
	type MatchWithOutcome = Match & { outcome?: MatchOutcome };

	interface Props {
		/** A list of matches to display. */
		matches: Match[];
		/**
		 * The user to filter by. This will also arrange participant lists so
		 * that the user comes first in the list.
		 */
		user?: string | null;
		class?: string | string[];
	}

	let { matches, user, class: className }: Props = $props();

	let showOpponentOnly = $derived(user != null);

	let tableClass = () => [className].flat().concat(['match-list']);

	let compareFn = (a: Participant, b: Participant) => {
		if (a.user.id === user) {
			return -1;
		} else if (b.user.id === user) {
			return 1;
		} else {
			return 0;
		}
	};

	const matchesFiltered = (): MatchWithOutcome[] => {
		if (user != null) {
			return (
				matches
					.filter((match) => match.participants.some((p) => p.user.id === user))
					// push the player to the top of the list
					.map((match) => ({ ...match, participants: match.participants.sort(compareFn) }))
					.map((match) => {
						// Add an additional property, "outcome," to the match.
						// From the filter above, we know that the first participant is
						// always the player we are inspecting.
						const me = match.participants[0];

						if (!match.rated) {
							return { ...match, outcome: 'no_contest' };
						} else if (me.noContest) {
							return { ...match, outcome: 'defeat' };
						} else {
							return { ...match, outcome: 'victory' };
						}
					})
			);
		} else {
			return matches;
		}
	};
</script>

<table class={tableClass()}>
	<thead>
		<tr>
			<th scope="row" title="The score the players finished with">Score</th>
			<th scope="row" colspan={user != null ? 2 : 3}></th>
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
			<MatchListEntry {match} outcome={match.outcome} {showOpponentOnly} />
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

		font-weight: normal;

		&:first-child {
			text-align: left;
		}

		&:last-child {
			text-align: right;
		}
	}
</style>
