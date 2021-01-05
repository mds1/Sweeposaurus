import { computed, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import { BigNumberish, BytesLike } from 'components/models';

/**
 * This store holds the transaction payload that will be used
 */

// State ===========================================================================================
const to = ref<string>();
const nonce = ref<number>();
const gasLimit = ref<BigNumberish>(ethers.BigNumber.from('21000'));
const gasPrice = ref<BigNumberish>();
const data = ref<BytesLike>('');
const value = ref<BigNumberish>('0');

export default function useTxStore() {
  // Mutations =====================================================================================
  function setTxTo(val: string) {
    to.value = ethers.utils.getAddress(val);
  }
  function setTxNonce(val: number) {
    nonce.value = val;
  }
  function setTxGasLimit(val: BigNumberish) {
    gasLimit.value = val;
  }
  function setTxGasPrice(val: BigNumberish) {
    gasPrice.value = val;
  }
  function setTxData(val: BytesLike) {
    data.value = val;
  }
  function setTxValue(val: BigNumberish) {
    value.value = val;
  }

  // Getters =======================================================================================
  // Transaction payload to send
  const txPayload = computed(() => {
    return {
      to: to.value,
      nonce: nonce.value,
      gasLimit: gasLimit.value,
      gasPrice: gasPrice.value,
      data: data.value,
      value: value.value,
    };
  });

  return {
    setTxTo,
    setTxNonce,
    setTxGasLimit,
    setTxGasPrice,
    setTxData,
    setTxValue,
    txPayload,
  };
}
