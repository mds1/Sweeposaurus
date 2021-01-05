<template>
  <div>
    <div>
      Some wallets, such as MetaMask, may
      <a
        href="https://docs.metamask.io/guide/sending-transactions.html#nonce-ignored"
        target="_blank"
        class="hyperlink"
      >
        ignore this value </a
      >. To override this, read the instructions
      <a
        href="https://medium.com/@safetythird/how-to-cancel-an-ethereum-transaction-2585a308d44"
        target="_blank"
        class="hyperlink"
      >
        here </a
      >.
    </div>
    <q-input
      v-model.number="nonce"
      class="q-mt-md"
      dense
      filled
      label="Nonce"
      style="max-width: 100px; display: inline-block;"
      type="number"
      @input="setNonce"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import useTxStore from 'src/store/tx';
import useWalletStore from 'src/store/wallet';
import { Signer } from 'components/models';

function useNonce() {
  const nonce = ref(0);
  const { signer } = useWalletStore();
  const { setTxNonce } = useTxStore();

  onMounted(async () => {
    // Get current nonce
    nonce.value = await (signer.value as Signer).getTransactionCount();
    setTxNonce(nonce.value);
  });

  function setNonce() {
    setTxNonce(nonce.value);
  }

  return { nonce, setNonce };
}

export default defineComponent({
  name: 'TransactionPayloadNonce',

  setup() {
    return { ...useNonce() };
  },
});
</script>
