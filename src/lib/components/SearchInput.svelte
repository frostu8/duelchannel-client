<script>
  import Textfield from '@smui/textfield';

  let value = $state('');
</script>

<Textfield
  class="dc-search"
  variant="outlined"
  bind:value={value}
  size="small"
>
</Textfield>

<style>
  :global(.dc-search) {
    height: 40px;
  }

  :global(.dc-search .mdc-notched-outline .mdc-notched-outline__leading) {
    border-radius: 28px 0 0 28px;
    width: 28px;
  }

  :global(.dc-search .mdc-notched-outline .mdc-notched-outline__trailing) {
    border-radius: 0 28px 28px 0;
  }

  :global(.dc-search .mdc-notched-outline .mdc-notched-outline__notch) {
    max-width: calc(100% - 28px * 2);
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
    padding-right: 28px;
  }
</style>
