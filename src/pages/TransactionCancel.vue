<template>
  <q-page padding class="text-center">
    <div>
      <!-- Header section -->
      <div class="text-h4">
        Cancel Transaction
      </div>
      <div class="q-mb-md">
        Simply click the button below
      </div>
    </div>

    <!-- Advanced settings -->
    <settings-advanced />

    <!-- Cancel button -->
    <img class="cancel-button q-my-lg" src="~assets/easy-button.png" @click="cancelTransaction" />

    <!-- Donation section -->
    <transaction-payload-donation v-if="!isLoading" />

    <!-- Transaction status -->
    <div v-if="isLoading" class="q-mt-xl">
      <q-icon class="text-gradient" name="fas fa-circle-notch fa-spin" size="3rem" />
      <div class="text-italic q-mt-md">Your transaction is processing...</div>
      <div class="text-caption">
        View on
        <a :href="etherscanUrl" target="_blank" class="hyperlink">Etherscan</a>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import SettingsAdvanced from 'components/SettingsAdvanced.vue';

import TransactionPayloadDonation from 'components/TransactionPayloadDonation.vue';

import useAlerts from 'src/utils/alerts';
import useWalletStore from 'src/store/wallet';
import useTxStore from 'src/store/tx';
import { Signer, TransactionResponse, Window } from 'components/models';

declare let window: Window;

function useCancelTransaction() {
  const { notifyUser, showError } = useAlerts();
  const { signer } = useWalletStore();

  const txHash = ref('');
  const isLoading = ref(false);
  const etherscanUrl = computed(() => `https://etherscan.io/tx/${txHash.value}`);

  /**
   * @notice Cancels pending transaction
   */
  async function cancelTransaction() {
    try {
      const { txPayload } = useTxStore();

      const tx: TransactionResponse = await (signer.value as Signer).sendTransaction({
        to: txPayload.value.to,
        nonce: txPayload.value.nonce,
        gasLimit: txPayload.value.gasLimit,
        gasPrice: txPayload.value.gasPrice,
        value: txPayload.value.value,
      });

      isLoading.value = true;
      txHash.value = String(tx.hash);
      console.log('Transaction sent', tx);

      const t = setInterval(function () {
        if (window.goatcounter && window.goatcounter.count) {
          clearInterval(t);
          window.goatcounter.count({
            path: 'transaction-cancelled-2',
            event: true,
          });
        }
      }, 100);

      await tx.wait();
      console.log('Transaction mined!');
      notifyUser('positive', 'Your cancellation was successful!');
      isLoading.value = false;
    } catch (e) {
      showError(e);
      isLoading.value = false;
    }
  }

  return {
    cancelTransaction,
    txHash,
    isLoading,
    etherscanUrl,
  };
}

export default defineComponent({
  name: 'PageTransactionCancel',

  components: {
    SettingsAdvanced,
    TransactionPayloadDonation,
  },

  setup() {
    return { ...useCancelTransaction() };
  },
});
</script>
