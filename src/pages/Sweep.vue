<template>
  <q-page padding class="text-center">
    <div>
      <!-- Header section -->
      <h4 class="row justify-center items-center q-mb-none">
        <img class="col-auto q-mr-md" alt="Sweeposaurus logo" src="~assets/app-logo.png" style="max-width: 7rem" />
        <div class="col-auto">Sweep Tokens</div>
      </h4>
      <div class="row justify-center text-center text-italic">
        <div class="col-auto q-pa-sm" style="border: 2px solid #e67635; border-radius: 10px">
          This is beta software and has not been heavily tested. Use at your own risk.
        </div>
      </div>
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
          class="top-border q-mt-md"
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

import erc20 from 'src/contracts/erc20.json';
import useAlerts from 'src/utils/alerts';
import useAnalytics from 'src/utils/analytics';
import useWalletStore from 'src/store/wallet';
import useTxStore from 'src/store/tx';
import { Signer, TransactionResponse } from 'components/models';

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
  async function send() {
    const { txPayload } = useTxStore();
    const { logEvent } = useAnalytics();
    const { to, gasPrice, value } = txPayload.value; // txPayload.value.value is donation amount
    const { BigNumber } = ethers;

    if (!to) throw new Error('Please specify a recipient address in Step 1');

    logEvent('send-started');

    for (let i = 0; i < balances.value.length; i += 1) {
      try {
        const tokenDetails = balances.value[i];
        const tokenContract = new ethers.Contract(tokenDetails.address, erc20.abi, signer.value);
        console.log('tokenDetails: ', tokenDetails);

        // Determine amount to send
        const amount =
          tokenDetails.amountToSend === 'max'
            ? tokenDetails.balance
            : ethers.utils.parseUnits(tokenDetails.amountToSend as string, tokenDetails.decimals);

        console.log('amount: ', amount);

        // Skip if amount is zero
        if (!amount || amount.eq(ethers.constants.Zero)) continue;

        // Send funds
        if (tokenDetails.symbol !== 'ETH') {
          // If not ETH, send token
          const tx = (await tokenContract.transfer(to, amount)) as TransactionResponse; // eslint-disable-line
        } else {
          // Sending ETH, handle donations + dust
          const donationAmount = BigNumber.from(value);
          const gasLimit = 21000;
          const initialBalance = tokenDetails.balance;

          // If donation amount is nonzero, send donation transaction
          let donationTxCost = ethers.constants.Zero;
          const isDonating = donationAmount.gt(ethers.constants.Zero);

          if (isDonating) {
            let donationTx: ethers.providers.TransactionResponse;
            try {
              donationTx = (await signer.value?.sendTransaction({
                to: '0x13cF9a5Ec23ae29CC06d36B3766DE6a096508Bc5',
                value: donationAmount,
                gasPrice,
                gasLimit,
              })) as ethers.providers.TransactionResponse;

              // Get cost of previous transaction (user may have adjusted gas limit in wallet)
              const txData = (await signer.value?.provider.getTransaction(
                donationTx.hash
              )) as ethers.providers.TransactionResponse;
              const { gasPrice: prevGasPrice, gasLimit: prevGasLimit } = txData;
              donationTxCost = prevGasPrice.mul(prevGasLimit).add(donationAmount);
            } catch (e) {
              // Continue if user skips donation transaction
              console.warn(e);
            }
          }

          // Sweep the rest of the ETH
          // (this causes transfer to fail if user increases gas limit)
          const ethAvailableToTransfer = initialBalance.sub(donationTxCost);
          const txCost = BigNumber.from(gasPrice).mul(gasLimit);
          const ethTx = (await signer.value?.sendTransaction({
            to,
            value: ethAvailableToTransfer.sub(txCost),
            gasPrice,
            gasLimit,
          })) as ethers.providers.TransactionResponse;
        }

        logEvent('send-complete');
        console.log('Complete!');
        notifyUser('positive', 'Your tokens have successfully been swept!');
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
