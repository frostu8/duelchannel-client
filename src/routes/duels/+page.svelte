<script>
  import MatchList from '$lib/components/MatchList.svelte';

  let { data } = $props();
</script>

<article class="match-list">
  <MatchList matches={data.matches} class="match-list-inner"/>
</article>

<style>
  .match-list {
    max-width: 960px;
    margin: auto;
    font-size: 1.2rem;
  }

  :global(.match-list-inner) {
    width: 100%;
  }
</style>
