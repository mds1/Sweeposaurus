<template>
  <q-page padding class="text-center">
    <div>
      What would you like to do?
      <div class="row justify-center q-mt-lg">
        <!-- Cancel Transaction -->
        <q-card class="card-border col-xs-4 col-sm-3 col-md-2 q-py-md q-mr-md">
          <connect-wallet redirect-to="cancel">
            <q-card-section>
              <img src="~assets/fa-trash.png" style="height: 3rem;" />
            </q-card-section>
            <q-card-section>
              <span style="font-size: 1.1rem;"> Cancel </span>
              <br /><span>Transaction</span>
            </q-card-section>
          </connect-wallet>
        </q-card>

        <!-- Speed up transaction -->
        <q-card class="card-border col-xs-4 col-sm-3 col-md-2 q-py-md q-ml-md">
          <connect-wallet redirect-to="speedUp">
            <q-card-section>
              <img src="~assets/fa-speedometer.png" style="height: 3rem;" />
            </q-card-section>
            <q-card-section>
              <span style="font-size: 1.1rem;"> Speed Up </span>
              <br /><span>Transaction</span>
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
