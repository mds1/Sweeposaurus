<template>
  <div>
    <!-- We use v-show to ensure mounted hook of components run, which populates default values -->
    <div class="row justify-center q-mt-lg" style="max-width: 800px; margin-left: auto; margin-right: auto">
      <settings-container setting-name="Recipient" class="card-border-no-hover col-xs-4 q-mx-sm">
        <transaction-payload-to />
      </settings-container>

      <settings-container setting-name="Gas Price" class="card-border-no-hover col-xs-4 q-mx-sm">
        <transaction-payload-gas-price />
      </settings-container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import SettingsContainer from 'components/SettingsContainer.vue';
import TransactionPayloadGasPrice from 'components/TransactionPayloadGasPrice.vue';
import TransactionPayloadTo from 'components/TransactionPayloadTo.vue';

export default defineComponent({
  name: 'SettingsAdvanced',

  components: {
    TransactionPayloadGasPrice,
    TransactionPayloadTo,
    SettingsContainer,
  },
});
</script>
