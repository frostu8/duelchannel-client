<script>
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
  import { mdiMagnify } from '@mdi/js';

  let value = $state('');
</script>

<Textfield
  class="dc-search"
  variant="outlined"
  bind:value={value}
>
  {#snippet trailingIcon()}
    <Icon class="material-icons">search</Icon>
  {/snippet}
</Textfield>

<style>
  :global(.dc-search) {
    max-width: 640px;
    width: 100%;
    height: 40px;
  }

  :global(.dc-search .mdc-notched-outline .mdc-notched-outline__leading) {
    border-radius: 20px 0 0 20px;
    width: 20px;
  }

  :global(.dc-search .mdc-notched-outline .mdc-notched-outline__trailing) {
    border-radius: 0 20px 20px 0;
  }

  :global(.dc-search .mdc-notched-outline .mdc-notched-outline__notch) {
    max-width: calc(100% - 20px * 2);
  }

  :global(
    .dc-search.mdc-text-field--with-leading-icon:not(
      .mdc-text-field--label-floating
    )
    .mdc-floating-label
  ) {
    left: 16px;
  }

  :global(.dc-search + .mdc-text-field-helper-line) {
    padding-left: 32px;
    padding-right: 20px;
  }
</style>
