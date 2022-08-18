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
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import { serialize as serializeTransaction } from '@ethersproject/transactions';

import SettingsAdvanced from 'components/SettingsAdvanced.vue';
import TransactionPayloadDonation from 'components/TransactionPayloadDonation.vue';

import erc20 from 'src/contracts/erc20.json';
import useAlerts from 'src/utils/alerts';
import useAnalytics from 'src/utils/analytics';
import useWalletStore from 'src/store/wallet';
import useTxStore from 'src/store/tx';
import { TransactionResponse } from 'components/models';

function useSweeper() {
  const { notifyUser, handleError } = useAlerts();
  const { balances, scan, signer, userAddress } = useWalletStore();

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

  async function getEthSweepGasInfo(from: string, to: string) {
    const provider = signer.value?.provider;
    if (!provider) throw new Error('Provider not found');

    const [network, fromBalance, gasPrice] = await Promise.all([
      provider.getNetwork(),
      provider.getBalance(from),
      provider.getGasPrice(),
    ]);
    const { chainId } = network;
    const gasLimit = await provider.estimateGas({ gasPrice: 0, to, from, value: fromBalance });

    // On Optimism, we ask the gas price oracle for the L1 data fee that we should add on top of the L2 execution
    // cost: https://community.optimism.io/docs/developers/build/transaction-fees/
    // For Arbitrum, this is baked into the gasPrice returned from the provider.
    let txCost = gasPrice.mul(gasLimit);
    if (chainId === 10) {
      const nonce = await provider.getTransactionCount(from);
      const gasOracleAbi = ['function getL1Fee(bytes memory _data) public view returns (uint256)'];
      const gasPriceOracle = new ethers.Contract('0x420000000000000000000000000000000000000F', gasOracleAbi, provider);
      // eslint-disable-next-line
      const l1FeeInWei = await gasPriceOracle.getL1Fee(
        serializeTransaction({ to, value: fromBalance, data: '0x', gasLimit, gasPrice, nonce })
      );
      txCost = txCost.add(l1FeeInWei);
    }

    // Return the gas price, gas limit, and the transaction cost
    return { gasPrice, gasLimit, txCost, fromBalance, ethToSend: fromBalance.sub(txCost), chainId };
  }

  /**
   * @notice Sends all transfers
   */
  async function send() {
    const { txPayload } = useTxStore();
    const { logEvent } = useAnalytics();
    const { to, value } = txPayload.value; // txPayload.value.value is donation amount
    const { BigNumber } = ethers;

    if (!to) throw new Error('Please specify a recipient address in Step 1');
    if (!userAddress.value) throw new Error('User address not found');
    logEvent('send-started');

    for (let i = 0; i < balances.value.length; i += 1) {
      try {
        const tokenDetails = balances.value[i];
        const tokenContract = new ethers.Contract(tokenDetails.address, erc20.abi, signer.value);

        // Determine amount to send
        const amount =
          tokenDetails.amountToSend === 'max'
            ? tokenDetails.balance
            : ethers.utils.parseUnits(tokenDetails.amountToSend as string, tokenDetails.decimals);

        // Skip if amount is zero
        if (!amount || amount.eq(ethers.constants.Zero)) continue;

        // Send funds
        if (tokenDetails.symbol !== 'ETH') {
          // If not ETH, send token
          const tx = (await tokenContract.transfer(to, amount)) as TransactionResponse; // eslint-disable-line
        } else {
          // Sending ETH, handle donations + dust
          const donationAmount = BigNumber.from(value);
          const isDonating = donationAmount.gt(ethers.constants.Zero);

          if (isDonating) {
            try {
              const donationAddr = '0x13cF9a5Ec23ae29CC06d36B3766DE6a096508Bc5';
              await signer.value?.sendTransaction({ to: donationAddr, value: donationAmount });
            } catch (e) {
              // Continue if user choose to skip/reject donation transaction
              console.warn('Donation transaction failed. See below for details.');
              console.warn(e);
            }
          }

          // Sweep the rest of the ETH
          const sweepInfo = await getEthSweepGasInfo(userAddress.value, to);
          const { gasPrice, gasLimit, txCost, fromBalance, ethToSend } = sweepInfo;
          if (txCost.gt(fromBalance)) throw new Error('Insufficient ETH balance to sweep ETH from account');
          await signer.value?.sendTransaction({ to, value: ethToSend, gasPrice, gasLimit });
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
