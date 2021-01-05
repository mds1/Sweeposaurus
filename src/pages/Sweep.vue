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
    <div v-else>
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

interface TokenDetails extends TokenInfo {
  balance: ethers.BigNumber;
}

function useSweeper() {
  const { notifyUser, handleError } = useAlerts();
  const { userAddress, signer } = useWalletStore();

  const balances = ref<TokenDetails[]>([]);
  const txHash = ref('');
  const isLoading = ref(true);
  const etherscanUrl = computed(() => `https://etherscan.io/tx/${txHash.value}`);

  onMounted(async () => {
    isLoading.value = true;
    await scan(userAddress.value as string);
    isLoading.value = false;
  });

  async function fetchTokenList() {
    const jsonFetch = (url: string) => fetch(url).then((res) => res.json());
    const url = 'https://tokens.coingecko.com/uniswap/all.json';
    const response = await jsonFetch(url);
    return response.tokens as TokenInfo[];
  }

  async function scan(userAddress: string) {
    // Get token list
    const tokenList = await fetchTokenList();

    // Get Multicall instance
    // prettier-ignore
    const multicallAbi = [ { constant: false, inputs: [ { components: [ { internalType: 'address', name: 'target', type: 'address' }, { internalType: 'bytes', name: 'callData', type: 'bytes' }, ], internalType: 'struct Multicall.Call[]', name: 'calls', type: 'tuple[]', }, ], name: 'aggregate', outputs: [ { internalType: 'uint256', name: 'blockNumber', type: 'uint256' }, { internalType: 'bytes[]', name: 'returnData', type: 'bytes[]' }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }], name: 'getBlockHash', outputs: [{ internalType: 'bytes32', name: 'blockHash', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockCoinbase', outputs: [{ internalType: 'address', name: 'coinbase', type: 'address' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockDifficulty', outputs: [{ internalType: 'uint256', name: 'difficulty', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockGasLimit', outputs: [{ internalType: 'uint256', name: 'gaslimit', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockTimestamp', outputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [{ internalType: 'address', name: 'addr', type: 'address' }], name: 'getEthBalance', outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getLastBlockHash', outputs: [{ internalType: 'bytes32', name: 'blockHash', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function', } ];
    const multicallAddress = '0x5e227AD1969Ea493B43F840cfF78d08a6fc17796';
    const multicall = new ethers.Contract(multicallAddress, multicallAbi, signer.value);

    // Generate balance calls using Multicall contract
    // prettier-ignore
    const erc20Abi = [ { constant: true, inputs: [], name: 'name', outputs: [ { name: '', type: 'string', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: false, inputs: [ { name: '_spender', type: 'address', }, { name: '_value', type: 'uint256', }, ], name: 'approve', outputs: [ { name: '', type: 'bool', }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [], name: 'totalSupply', outputs: [ { name: '', type: 'uint256', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: false, inputs: [ { name: '_from', type: 'address', }, { name: '_to', type: 'address', }, { name: '_value', type: 'uint256', }, ], name: 'transferFrom', outputs: [ { name: '', type: 'bool', }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [], name: 'decimals', outputs: [ { name: '', type: 'uint8', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [ { name: '_owner', type: 'address', }, ], name: 'balanceOf', outputs: [ { name: 'balance', type: 'uint256', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'symbol', outputs: [ { name: '', type: 'string', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: false, inputs: [ { name: '_to', type: 'address', }, { name: '_value', type: 'uint256', }, ], name: 'transfer', outputs: [ { name: '', type: 'bool', }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [ { name: '_owner', type: 'address', }, { name: '_spender', type: 'address', }, ], name: 'allowance', outputs: [ { name: '', type: 'uint256', }, ], payable: false, stateMutability: 'view', type: 'function', }, { payable: true, stateMutability: 'payable', type: 'fallback', }, { anonymous: false, inputs: [ { indexed: true, name: 'owner', type: 'address', }, { indexed: true, name: 'spender', type: 'address', }, { indexed: false, name: 'value', type: 'uint256', }, ], name: 'Approval', type: 'event', }, { anonymous: false, inputs: [ { indexed: true, name: 'from', type: 'address', }, { indexed: true, name: 'to', type: 'address', }, { indexed: false, name: 'value', type: 'uint256', }, ], name: 'Transfer', type: 'event', } ];
    const calls = tokenList.map((token) => {
      const { address: tokenAddress } = token;
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer.value);
      return { target: tokenAddress, callData: tokenContract.interface.encodeFunctionData('balanceOf', [userAddress]) };
    });

    // Generate array of promises to get token balances + ETH balance
    const ethBalancePromise = signer.value?.getBalance();
    const promises = [multicall.callStatic.aggregate(calls), ethBalancePromise];

    // Wait for promises to resolve
    const responses = await Promise.all(promises);
    let tokenBalances = responses[0].returnData as string[]; // token balances from multicall

    // Append ETH balance to balance array and token list array
    tokenBalances = [...tokenBalances]; // create new array because otherwise we cannot modify it
    tokenBalances.push(responses[1].toHexString());
    tokenList.push({
      chainId: 1,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ether',
      decimals: 18,
      symbol: 'ETH',
      logoURI: '/public/logos/eth.png',
    });

    // Create array of all tokens with their balance and only keep nonzero ones
    balances.value = tokenList
      .map((token, index) => ({ ...token, balance: ethers.BigNumber.from(tokenBalances[index]) }))
      .filter((token) => token.balance.gt(ethers.constants.Zero))
      .sort((token1, token2) => token1.symbol.localeCompare(token2.symbol));
    console.log('balances: ', balances.value);
  }

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

      // const t = setInterval(function () {
      //   if (window.goatcounter && window.goatcounter.count) {
      //     clearInterval(t);
      //     window.goatcounter.count({
      //       path: 'transaction-cancelled-2',
      //       event: true,
      //     });
      //   }
      // }, 100);

      await tx.wait();
      console.log('Transaction mined!');
      notifyUser('positive', 'Your cancellation was successful!');
      isLoading.value = false;
    } catch (e) {
      handleError(e);
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
