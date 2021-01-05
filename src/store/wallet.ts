import { computed, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import { Signer, Provider } from 'components/models';

/**
 * State is handled in reusable components, where each component is its own self-contained
 * file consisting of one function defined used the composition API.
 *
 * Since we want the wallet state to be shared between all instances when this file is imported,
 * we defined state outside of the function definition.
 */

// State ===========================================================================================
// We do not publicly expose the state to provide control over when and how it's changed. It
// can only be changed through actions and mutations, and it can only be accessed with getters.
// As a result, only actions, mutations, and getters are returned from this function.
const provider = ref<Provider | undefined>(undefined);
const signer = ref<Signer | undefined>(undefined);
const userAddress = ref<string | undefined>(undefined);

export default function useWalletStore() {
  // Actions =======================================================================================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setProvider(p: any) {
    provider.value = new ethers.providers.Web3Provider(p);
    signer.value = provider.value.getSigner();
    userAddress.value = await signer.value.getAddress();
  }

  // Getters =======================================================================================
  // Currently not used, but would defined in the style shown below
  // const signer = computed((): Signer | undefined =>
  //   provider.value?.getSigner()
  // );

  return {
    provider: computed(() => provider.value),
    signer: computed(() => signer.value),
    userAddress: computed(() => userAddress.value),
    setProvider,
  };
}
