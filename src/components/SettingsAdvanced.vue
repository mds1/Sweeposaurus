<template>
  <div class="text-left">
    <!-- We use v-show to ensure mounted hook of components run, which populates default values -->
    <div class="row justify-start q-mt-lg" style="max-width: 800px; margin-left: auto; margin-right: auto">
      <settings-container setting-name="Recipient" class="card-border-no-hover col-xs-4 q-mr-md">
        <transaction-payload-to />
      </settings-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import SettingsContainer from 'components/SettingsContainer.vue';
import TransactionPayloadTo from 'components/TransactionPayloadTo.vue';

export default defineComponent({
  name: 'SettingsAdvanced',

  components: {
    TransactionPayloadTo,
    SettingsContainer,
  },
});
</script>
