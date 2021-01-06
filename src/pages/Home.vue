<template>
  <q-page padding class="text-center">
    <div>
      <div class="row justify-center items-center">
        <img class="col-auto q-mr-md" alt="Sweeposaurus logo" src="~assets/app-logo.png" style="max-width: 10rem" />
        <div class="col-auto text-left">
          <div style="font-size: 1.1rem">Say hello to</div>
          <h1 class="q-my-none">Sweeposaurus</h1>
          <div>He'll make it easy to sweep all your tokens to a new address!</div>
        </div>
      </div>
      <div class="row justify-center q-mt-xl">
        <q-card class="card-border col-xs-4 col-sm-3 col-md-2 q-py-md q-mr-md">
          <connect-wallet redirect-to="sweep">
            <q-card-section>
              <q-icon name="fas fa-wallet" class="text-primary" style="font-size: 3rem" />
            </q-card-section>
            <q-card-section>
              <span style="font-size: 1.1rem"> Connect Wallet </span>
            </q-card-section>
          </connect-wallet>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import ConnectWallet from 'components/ConnectWallet.vue';
import useEthUsdPrice from 'src/utils/ethUsdPrice';

export default defineComponent({
  name: 'PageHome',
  components: { ConnectWallet },
  setup() {
    // Fetch ETH/USD price on page load
    useEthUsdPrice();
  },
});
</script>
