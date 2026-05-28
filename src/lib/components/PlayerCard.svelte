<script>
  import Card, { Content } from '@smui/card';
  import Counter from './counter/Counter.svelte';

  let { player } = $props();
</script>

<div class="dc-card">
  <Card>
    <Content>
      <h2 class="card-title">{ player["display_name"] }</h2>
      <Counter class={["card-mmr"]} small padding={4} number={player["mmr"]}/>
    </Content>
  </Card>
</div>

<style>
  :global(.dc-card .card-mmr) {
    margin-right: auto;
  }

  .dc-card {
    margin: 12px 24px;
  }

  .card-title {
    margin-bottom: 12px;
  }
</style>
