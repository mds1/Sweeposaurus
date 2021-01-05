<template>
  <q-page padding class="text-center">
    <div>
      <!-- Header section -->
      <div class="text-h4">Sweep tokens</div>
      <!-- <div class="q-mb-md">Simply click the button below</div> -->
    </div>

    <div v-if="isLoading">
      <q-spinner-puff class="q-mt-xl" color="primary" size="5em" />
      <p class="text-caption text-italic q-mt-md">Scanning for tokens in your wallet. This may take a minute...</p>
    </div>

    <div v-else style="margin: 0 auto; max-width: 800px">
      <!-- Advanced settings -->
      <div>
        <h5 class="text-left q-mb-xs">Step 1: Enter recipient address</h5>
        <div class="text-left">Optionally, you can override the default gas price.</div>
        <settings-advanced />
      </div>

      <!-- Token table -->
      <div class="q-my-xl">
        <h5 class="text-left q-mb-xs">Step 2: Choose tokens to send</h5>
        <div class="text-left">
          To send the max amount, leave the value untouched. To send nothing, set the value to 0.
        </div>
        <div class="text-left text-caption text-grey">
          If you have a lot of tokens, this will be a long table&mdash;just keep scrolling for step 3!
        </div>
        <q-table
          class="q-mt-md"
          title="Tokens"
          :data="balances"
          :columns="tableColumns"
          :pagination="{ rowsPerPage: balances.length }"
          row-key="address"
        >
          <!-- Header labels -->
          <template #header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>

          <!-- Token name -->
          <template #body-cell-symbol="props">
            <q-td :props="props">
              <div class="row justify-start items-center">
                <img class="col-auto q-mr-md" :src="props.row.logoURI" style="width: 2rem" />
                <div class="col-auto">
                  <div>{{ props.value }}</div>
                  <div class="text-caption text-grey">{{ props.row.name }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Token balance -->
          <template #body-cell-balance="props">
            <q-td :props="props">
              <div>{{ formatBalance(props.value, props.row.decimals) }}</div>
            </q-td>
          </template>

          <!-- Amounts to send -->
          <template #body-cell-amount="props">
            <q-td :props="props">
              <q-input
                v-model="balances[props.pageIndex].amountToSend"
                dense
                filled
                :mask="
                  balances[props.pageIndex].amountToSend === 'max'
                    ? formatBalance(props.row.balance, props.row.decimals)
                    : undefined
                "
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <h5 class="text-left q-mb-xs">Step 3: Consider donating</h5>
      <!-- Donation section -->
      <transaction-payload-donation v-if="!isLoading" />

      <div class="text-left">
        <h5 class="q-mb-xs">Step 4: Send tokens!</h5>
        <div>You will have to approve one transaction for each transfer.</div>
        <q-btn class="q-my-lg" color="primary" label="Send" @click="send" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import { TokenInfo } from '@uniswap/token-lists';

import SettingsAdvanced from 'components/SettingsAdvanced.vue';
import TransactionPayloadDonation from 'components/TransactionPayloadDonation.vue';

import useAlerts from 'src/utils/alerts';
import useWalletStore from 'src/store/wallet';
import useTxStore from 'src/store/tx';
import { Signer, TransactionResponse, Window } from 'components/models';

declare let window: Window;

function useSweeper() {
  const { notifyUser, handleError } = useAlerts();
  const { balances, scan, signer } = useWalletStore();

  const isLoading = ref(true);

  const tableColumns = [
    { align: 'left', name: 'symbol', label: 'Asset', sortable: true, field: 'symbol' },
    { align: 'left', name: 'balance', label: 'Balance', sortable: true, field: 'balance' },
    { align: 'left', name: 'amount', label: 'Amount to Send', sortable: true, field: 'amount' },
  ];

  onMounted(async () => {
    isLoading.value = true;
    await scan();
    isLoading.value = false;
    console.log('balances: ', balances.value);
  });

  function formatBalance(value: string, decimals: string) {
    return Number(ethers.utils.formatUnits(value, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    });
  }

  /**
   * @notice Sends all transfers
   */
  function send() {
    for (let i = 0; i < balances.value.length; i += 1) {
      try {
        const tokenDetails = balances.value[i];
        console.log('tokenDetails: ', tokenDetails);

        // const { txPayload } = useTxStore();

        // const tx: TransactionResponse = await (signer.value as Signer).sendTransaction({
        //   to: txPayload.value.to,
        //   nonce: txPayload.value.nonce,
        //   gasLimit: txPayload.value.gasLimit,
        //   gasPrice: txPayload.value.gasPrice,
        //   value: txPayload.value.value,
        // });

        // isLoading.value = true;

        // const t = setInterval(function () {
        //   if (window.goatcounter && window.goatcounter.count) {
        //     clearInterval(t);
        //     window.goatcounter.count({
        //       path: 'transaction-cancelled-2',
        //       event: true,
        //     });
        //   }
        // }, 100);

        // await tx.wait();
        // console.log('Transaction mined!');
        // notifyUser('positive', 'Your cancellation was successful!');
        // isLoading.value = false;
      } catch (e) {
        handleError(e);
        isLoading.value = false;
      }
    }
  }

  return {
    balances,
    formatBalance,
    tableColumns,
    isLoading,
    send,
  };
}

export default defineComponent({
  name: 'PageSweep',

  components: {
    SettingsAdvanced,
    TransactionPayloadDonation,
  },

  setup() {
    return { ...useSweeper() };
  },
});
</script>
