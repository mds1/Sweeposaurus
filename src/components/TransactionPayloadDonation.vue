<template>
  <div>
    <q-checkbox v-model="buyBeer" size="sm" @input="setTxPayload">
      <span style="font-size: 1rem;">Buy me a beer</span>
      <span class="q-ml-sm" style="font-size: 1.1rem;">🍺</span>
    </q-checkbox>
    <div class="text-caption">
      <span>
        Sends&nbsp;
        <q-input
          v-model.number="beerPrice"
          dense
          input-class="text-center text-caption"
          step="0.001"
          style="max-width: 50px; display: inline-block;"
          type="number"
          @input="setTxPayload"
        />&nbsp;ETH
        <span v-if="ethUsdPrice !== 0">
          (about ${{ Math.round(Number(ethUsdPrice * beerPrice)) }})
        </span>
        to the developer as part of the cancellation
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import useTxStore from 'src/store/tx';
import useWalletStore from 'src/store/wallet';
import useEthUsdPrice from 'src/utils/ethUsdPrice';

function useDonationData() {
  const { userAddress } = useWalletStore();
  const { setTxTo, setTxValue } = useTxStore();

  const buyBeer = ref(true);
  const beerPrice = ref(0.005); // in ETH

  function setTxPayload() {
    const donationAddress = '0x3a9bE12aB20Ef966f35325763C21EAa764D639C3';
    const isDonating = buyBeer.value && beerPrice.value > 0; // make sure checkbox is ticked and amount is above zero
    const recipient = isDonating ? donationAddress : userAddress.value;
    const amount = isDonating
      ? ethers.utils.parseEther(String(beerPrice.value))
      : ethers.constants.Zero;
    setTxValue(amount);
    setTxTo(String(recipient));
  }

  onMounted(() => {
    // Set donation amount, in ETH, to be about $3 based on current ETH price. Since we truncate to
    // 3 decimals for readability/clarity the default donation value may fluctuate between about $2–$4
    try {
      const { ethUsdPrice } = useEthUsdPrice();
      const targetDonationAmount = 3; // in USD
      beerPrice.value = Number((targetDonationAmount / ethUsdPrice.value).toFixed(3)); // 3 decimal places
    } catch (e) {
      console.log('Could not calculate beer price, so using default value');
      console.warn(e);
    }

    // Set default transaction payload
    setTxPayload();
  });

  return { buyBeer, beerPrice, setTxPayload };
}

export default defineComponent({
  name: 'TransactionPayloadDonation',

  setup() {
    return { ...useEthUsdPrice(), ...useDonationData() };
  },
});
</script>
