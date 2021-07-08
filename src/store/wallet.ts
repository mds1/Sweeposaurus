import { computed, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import { TokenList } from '@uniswap/token-lists';
import { MulticallResponse, Signer, Provider, TokenDetails } from 'components/models';
import multicallInfo from 'src/contracts/multicall.json';
import erc20 from 'src/contracts/erc20.json';
import useAnalytics from 'src/utils/analytics';

const { Zero } = ethers.constants;

// Returns an address with the following format: 0x1234...abcd
const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(38)}`;

/**
 * State is handled in reusable components, where each component is its own self-contained
 * file consisting of one function defined used the composition API.
 *
 * Since we want the wallet state to be shared between all instances when this file is imported,
 * we defined state outside of the function definition.
 */

// ============================================= State =============================================
// We do not publicly expose the state to provide control over when and how it's changed. It
// can only be changed through actions and mutations, and it can only be accessed with getters.
// As a result, only actions, mutations, and getters are returned from this function.
const provider = ref<Provider | undefined>(undefined);
const signer = ref<Signer | undefined>(undefined);
const userAddress = ref<string | undefined>(undefined);
const userDisplayName = ref<string | undefined>(undefined);
const balances = ref<TokenDetails[]>([]);

export default function useWalletStore() {
  // =========================================== Actions ===========================================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setProvider(p: any) {
    provider.value = new ethers.providers.Web3Provider(p);
    signer.value = provider.value.getSigner();
    const _userAddress = await signer.value.getAddress();
    const userEns = await provider.value.lookupAddress(_userAddress);

    userAddress.value = _userAddress;
    userDisplayName.value = userEns || formatAddress(_userAddress);
  }

  async function fetchTokenList() {
    const jsonFetch = (url: string) => fetch(url).then((res) => res.json());
    const url = 'https://tokens.coingecko.com/uniswap/all.json';
    const response = (await jsonFetch(url)) as TokenList;
    return response.tokens;
  }

  async function scan() {
    const { logEvent } = useAnalytics();
    logEvent('scan-started');

    // Get token list
    const tokenList = await fetchTokenList();

    // Get Multicall instance
    const multicall = new ethers.Contract(multicallInfo.address, multicallInfo.abi, signer.value);

    // Generate balance calls using Multicall contract
    const calls = tokenList.map((token) => {
      const { address: tokenAddress } = token;
      const tokenContract = new ethers.Contract(tokenAddress, erc20.abi, signer.value);
      return {
        target: tokenAddress,
        callData: tokenContract.interface.encodeFunctionData('balanceOf', [userAddress.value]),
      };
    });

    // Generate array of promises to get token balances + ETH balance
    const ethBalancePromise = signer.value?.getBalance();
    const promises = [multicall.callStatic.aggregate(calls), ethBalancePromise];

    // Wait for promises to resolve
    const responses = await Promise.all(promises);
    const multicallResponse = responses[0] as MulticallResponse;
    const ethResponse = responses[1] as ethers.BigNumber;
    const tokenBalances = multicallResponse.returnData; // token balances from multicall

    // Create array of all tokens with their balance and only keep nonzero ones
    balances.value = tokenList
      .map((token, index) => {
        // `tokenBalances[index] === '0x'` occurs when a token in the token list is an EOA or non ERC-20 contract, so
        // instead of returning a balance we get no data
        const balance = tokenBalances[index] === '0x' ? Zero : ethers.BigNumber.from(tokenBalances[index]);
        return { ...token, balance, amountToSend: 'max' };
      })
      .filter((token) => token.balance.gt(Zero))
      .sort((token1, token2) => token1.symbol.localeCompare(token2.symbol));

    // Append ETH to the list
    const ethToken = {
      chainId: 1,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ether',
      decimals: 18,
      symbol: 'ETH',
      logoURI: 'logos/eth.png',
    };
    balances.value.push({
      ...ethToken,
      balance: ethResponse,
      amountToSend: 'max',
    });
  }

  return {
    provider: computed(() => provider.value),
    signer: computed(() => signer.value),
    userAddress: computed(() => userAddress.value),
    userDisplayName: computed(() => userDisplayName.value),
    setProvider,
    scan,
    balances: computed(() => balances.value),
  };
}
