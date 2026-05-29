<script>
  import SearchInput from './SearchInput.svelte';
  import { page } from '$app/state';
</script>

<nav class="dc-navbar">
  <!-- <SearchInput /> -->
  {#snippet btn(title, href)}
  <a
    {href}
    class={{
      ["navbar-btn"]: true,
      ["selected"]: page.url.pathname === href
    }}
  >
    {title}
  </a>
  {/snippet}
  {@render btn('Players','/')}
  {@render btn('Servers','/server')}
</nav>

<style>
  .dc-navbar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 0 12px;
    background: var(--bg-secondary);
  }

  .navbar-btn {
    margin: 0 12px;
    padding: 12px 12px;
    color: var(--text-secondary);
    text-decoration: none;
    border-bottom: 2px solid var(--bg-secondary);
  }

  .navbar-btn.selected {
    color: var(--accent);
    border-color: var(--accent);
  }
</style>
