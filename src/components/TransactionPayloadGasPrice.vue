<template>
  <div>
    <div>Override the default gas price of {{ gasPriceGwei }} gwei.</div>
    <q-input
      v-model.number="gasPriceGwei"
      class="q-mt-md"
      dense
      filled
      label="Gas price"
      style="max-width: 100px; display: inline-block;"
      type="number"
      @input="setGasPrice"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import useTxStore from 'src/store/tx';
import useWalletStore from 'src/store/wallet';
import { BigNumber, Signer } from 'components/models';

function useGasPrice() {
  const scale = '1000000000';
  const gasPrice = ref<BigNumber>(); // wei
  const gasPriceGwei = ref(0); // gwei, number
  const { signer } = useWalletStore();
  const { setTxGasPrice } = useTxStore();

  onMounted(async () => {
    gasPrice.value = await getGasPrice(); // BigNumber
    gasPriceGwei.value = gasPrice.value.div(scale).toNumber();
    setTxGasPrice(gasPrice.value);
  });

  async function getGasPrice(): Promise<BigNumber> {
    const rawGasPrice = await (signer.value as Signer).getGasPrice();
    return rawGasPrice.mul('2');
  }

  function setGasPrice() {
    gasPrice.value = ethers.BigNumber.from(gasPriceGwei.value).mul(scale);
    setTxGasPrice(gasPrice.value);
  }

  return { gasPrice, gasPriceGwei, setGasPrice };
}

export default defineComponent({
  name: 'TransactionPayloadGasPrice',

  setup() {
    return { ...useGasPrice() };
  },
});
</script>
