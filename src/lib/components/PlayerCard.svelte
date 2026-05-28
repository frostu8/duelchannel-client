<script>
  import Card, { Content } from '@smui/card';
  import Counter from './counter/Counter.svelte';
  import MiniBadgeDisplay from './MiniBadgeDisplay.svelte';

  let { player } = $props();
</script>

<div class="dc-card">
  <Card>
    <Content>
      <h2 class="card-title">{ player["display_name"] }</h2>
      <div class="card-subheader">
        <Counter class={["card-mmr"]} small padding={4} number={player["mmr"]}/>
        <MiniBadgeDisplay --height="1.25em" flags={ player["flags"] } />
      </div>
    </Content>
  </Card>
</div>

<style>
  :global(.dc-card .card-mmr) {
    margin-right: 12px;
  }

  .card-subheader {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: left;
  }

  .dc-card {
    margin: 12px 24px;
  }

  .card-title {
    margin-bottom: 12px;
  }
</style>
