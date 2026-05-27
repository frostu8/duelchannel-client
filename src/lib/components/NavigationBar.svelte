<script>
  import SearchInput from './SearchInput.svelte';
</script>

<nav class="dc-navbar">
  <SearchInput />
</nav>

<style>
  .dc-navbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: var(--bg-secondary);
  }
</style>
