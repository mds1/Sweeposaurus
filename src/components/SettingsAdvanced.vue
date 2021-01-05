<template>
  <div>
    <!-- Link to toggle visibility -->
    <div class="text-caption hyperlink" @click="showAdvanced = !showAdvanced">
      <span v-if="!showAdvanced">Show</span>
      <span v-else>Hide</span> advanced settings
    </div>

    <!-- We use v-show to ensure mounted hook of components run, which populates default values -->
    <div
      v-show="showAdvanced"
      class="row justify-center q-mt-lg"
      style="max-width: 800px; margin-left: auto; margin-right: auto;"
    >
      <settings-container setting-name="Nonce" class="card-border-no-hover col-xs-4 q-mx-sm">
        <transaction-payload-nonce />
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
import TransactionPayloadNonce from 'components/TransactionPayloadNonce.vue';

export default defineComponent({
  name: 'SettingsAdvanced',

  components: {
    TransactionPayloadGasPrice,
    TransactionPayloadNonce,
    SettingsContainer,
  },

  setup() {
    const showAdvanced = ref(false);
    return { showAdvanced };
  },
});
</script>
