<script>
	import { getPlayers } from "$lib/client/players";
	import Autocomplete from "@smui-extra/autocomplete";
	import Textfield from "@smui/textfield";
	import { Text } from '@smui/list';
  import CircularProgress from '@smui/circular-progress';
	import { useQueryClient } from "@tanstack/svelte-query";
	import RankDisplay from "./RankDisplay.svelte";

	/** @typedef {import('$lib/client/players').Player} Player */

  /**
   * @typedef {Object} PlayerSearchProps
   * @property {Player | null} [user]
   * @property {(user: Player) => void} [onSelect]
   * @property {string} [text]
   * The text currently in the search box.
   */

  /** @type {PlayerSearchProps} */
  let {
    onSelect,
    user = $bindable(null),
    text = $bindable(''),
  } = $props();

  const queryClient = useQueryClient();
  async function searchUsers() {
    if (text === '') return [];

    if (user != null) {
      // Return an array with just the already selected value to hide the menu.
      // As soon as the user changes the text field, the value is unselected, so
      // the search should run again.
      return [user];
    }

    return queryClient
      .query({
        queryKey: ['user', { search: text }],
        queryFn: () => getPlayers(fetch, { search: text }),
      });
  }
</script>

<!-- FUCK YOU!!!! -->
<Autocomplete
  class="player-search-input"
  search={searchUsers}
  getOptionLabel={user => user?.displayName}
  bind:value={user}
  bind:text={text}
  showMenuWithNoInput={false}
  selectOnExactMatch={false}
  onSMUIAutocompleteSelected={ev => onSelect?.(ev.detail)}
>
  {#snippet loading()}
    <Text
      style="display: flex; width: 100%; justify-content: center; align-items: center;"
    >
      <CircularProgress style="height: 24px; width: 24px;" indeterminate />
    </Text>
  {/snippet}
  {#snippet match(/** @type {Player} */ user)}
    {#if user.rank != null}
      <RankDisplay rank={user.rank} --height="2em" style="margin-right: 8px;"/>
    {:else}
      <RankDisplay rank="unranked" --height="2em" style="margin-right: 8px;"/>
    {/if}
    <Text>{user.displayName}</Text>
  {/snippet}
  <Textfield
    label="Search user"
    bind:value={text}
    class="inner-textfield"
    style="width: 24rem;"
    helperLine$style="width: 24rem;"
  />
</Autocomplete>

<style>
  :global(.player-search-input .mdc-menu-surface) {
    z-index: 100;
  }

  :global(.inner-textfield .mdc-line-ripple) {
    visibility: hidden;
  }
</style>
