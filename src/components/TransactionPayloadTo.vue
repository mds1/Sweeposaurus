<template>
  <div>
    <div>Enter the address tokens should be sent to</div>
    <q-input
      v-model="to"
      class="q-mt-md"
      dense
      filled
      label="Recipient"
      style="max-width: 100px; display: inline-block"
      type="number"
      @input="setRecipient"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import useTxStore from 'src/store/tx';
import useWalletStore from 'src/store/wallet';
import { Signer } from 'components/models';

function useRecipient() {
  const to = ref('');
  const { setTxTo } = useTxStore();

  function setRecipient() {
    setTxTo(to.value);
  }

  return { to, setRecipient };
}

export default defineComponent({
  name: 'TransactionPayloadTo',

  setup() {
    return { ...useRecipient() };
  },
});
</script>
