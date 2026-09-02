<script lang="ts">
	import UserFlags, { all } from '$lib/client/UserFlags';

	import badgeBetaTester from '$lib/assets/badges/beta_tester.png';
	import badgeBetaChallenger from '$lib/assets/badges/beta_challenger.png';

	interface Props {
		/** The flags to display. */
		flags: number;
	}

	let { flags }: Props = $props();

	let allBadges = all()
		.map((flag) => {
			switch (flag) {
				case UserFlags.BETA_TESTER:
					return {
						flag,
						src: badgeBetaTester,
						alt: 'Beta Tester',
						title: 'Played during BETA'
					};
				case UserFlags.BETA_CHALLENGER:
					return {
						flag,
						src: badgeBetaChallenger,
						alt: 'Beta Challenger',
						title: 'Awarded for outstanding merit during BETA'
					};
				default:
					return null;
			}
		})
		.filter((badge) => badge !== null);

	let badges = $derived.by(() => {
		return allBadges.filter((badge) => flags & badge.flag);
	});
</script>

<div class="badges-list">
	{#each badges as badge (badge.flag)}
		<img src={badge.src} alt={badge.alt} title={badge.title} draggable="false" />
	{/each}
</div>

<style>
	.badges-list {
		display: flex;
		flex-flow: row wrap;
		align-items: center;

		img {
			image-rendering: crisp-edges;
			height: var(--height, 1rem);
			margin: calc(var(--height, 1rem) / 8);
			transition: filter 0.2s;

			&:hover {
				filter: brightness(1.35);
			}
		}
	}
</style>
