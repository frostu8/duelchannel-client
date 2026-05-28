<script>
  import Card, { Content } from '@smui/card';
  import Counter from './counter/Counter.svelte';
  import MiniBadgeDisplay from './MiniBadgeDisplay.svelte';

  let { player } = $props();
</script>

<div class="dc-card">
  <Card>
    <Content>
      <div class="card-header">
        <h2 class="card-title">{ player["display_name"] }</h2>
        <MiniBadgeDisplay --height="1.25em" flags={ player["flags"] } />
      </div>
      <Counter class={["card-mmr"]} small padding={4} number={player["mmr"]}/>
    </Content>
  </Card>
</div>

<style>
  :global(.dc-card .card-mmr) {
    margin-right: auto;
  }

  .card-header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .dc-card {
    margin: 12px 24px;
  }
</style>
