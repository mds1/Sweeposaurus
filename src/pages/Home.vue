<template>
  <q-page padding class="text-center">
    <div>
      Connect a wallet to get started
      <div class="row justify-center q-mt-lg">
        <!-- Cancel Transaction -->
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
