import { onMounted, ref } from '@vue/composition-api';

// Keeping this declaration outside the main function ensures the value is shared between instances,
// allowing us to fetch the price when we first load the app
const ethUsdPrice = ref(0);

/**
 * @notice Gets ETH/USD price
 */
export default function useEthUsdPrice() {
  interface Price {
    ethereum: {
      usd: string;
    };
  }

  onMounted(async () => {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
      const response = await fetch(url);
      const json = (await response.json()) as Price;
      ethUsdPrice.value = Number(json.ethereum.usd);
    } catch (e) {
      console.error(e);
    }
  });

  return { ethUsdPrice };
}
