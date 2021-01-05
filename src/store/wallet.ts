import { computed, ref } from '@vue/composition-api';
import { ethers } from 'ethers';
import { TokenList } from '@uniswap/token-lists';
import { MulticallResponse, Signer, Provider, TokenDetails } from 'components/models';

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
const balances = ref<TokenDetails[]>([]);

export default function useWalletStore() {
  // =========================================== Actions ===========================================
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function setProvider(p: any) {
    provider.value = new ethers.providers.Web3Provider(p);
    signer.value = provider.value.getSigner();
    userAddress.value = await signer.value.getAddress();
  }

  async function fetchTokenList() {
    const jsonFetch = (url: string) => fetch(url).then((res) => res.json());
    const url = 'https://tokens.coingecko.com/uniswap/all.json';
    const response = (await jsonFetch(url)) as TokenList;
    return response.tokens;
  }

  async function scan() {
    // Get token list
    const tokenList = await fetchTokenList();

    // Get Multicall instance
    // prettier-ignore
    const multicallAbi = [ { constant: false, inputs: [ { components: [ { internalType: 'address', name: 'target', type: 'address' }, { internalType: 'bytes', name: 'callData', type: 'bytes' }, ], internalType: 'struct Multicall.Call[]', name: 'calls', type: 'tuple[]', }, ], name: 'aggregate', outputs: [ { internalType: 'uint256', name: 'blockNumber', type: 'uint256' }, { internalType: 'bytes[]', name: 'returnData', type: 'bytes[]' }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }], name: 'getBlockHash', outputs: [{ internalType: 'bytes32', name: 'blockHash', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockCoinbase', outputs: [{ internalType: 'address', name: 'coinbase', type: 'address' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockDifficulty', outputs: [{ internalType: 'uint256', name: 'difficulty', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockGasLimit', outputs: [{ internalType: 'uint256', name: 'gaslimit', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getCurrentBlockTimestamp', outputs: [{ internalType: 'uint256', name: 'timestamp', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [{ internalType: 'address', name: 'addr', type: 'address' }], name: 'getEthBalance', outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'getLastBlockHash', outputs: [{ internalType: 'bytes32', name: 'blockHash', type: 'bytes32' }], payable: false, stateMutability: 'view', type: 'function', } ];
    const multicallAddress = '0x5e227AD1969Ea493B43F840cfF78d08a6fc17796';
    const multicall = new ethers.Contract(multicallAddress, multicallAbi, signer.value);

    // Generate balance calls using Multicall contract
    // prettier-ignore
    const erc20Abi = [ { constant: true, inputs: [], name: 'name', outputs: [ { name: '', type: 'string', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: false, inputs: [ { name: '_spender', type: 'address', }, { name: '_value', type: 'uint256', }, ], name: 'approve', outputs: [ { name: '', type: 'bool', }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [], name: 'totalSupply', outputs: [ { name: '', type: 'uint256', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: false, inputs: [ { name: '_from', type: 'address', }, { name: '_to', type: 'address', }, { name: '_value', type: 'uint256', }, ], name: 'transferFrom', outputs: [ { name: '', type: 'bool', }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [], name: 'decimals', outputs: [ { name: '', type: 'uint8', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [ { name: '_owner', type: 'address', }, ], name: 'balanceOf', outputs: [ { name: 'balance', type: 'uint256', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: true, inputs: [], name: 'symbol', outputs: [ { name: '', type: 'string', }, ], payable: false, stateMutability: 'view', type: 'function', }, { constant: false, inputs: [ { name: '_to', type: 'address', }, { name: '_value', type: 'uint256', }, ], name: 'transfer', outputs: [ { name: '', type: 'bool', }, ], payable: false, stateMutability: 'nonpayable', type: 'function', }, { constant: true, inputs: [ { name: '_owner', type: 'address', }, { name: '_spender', type: 'address', }, ], name: 'allowance', outputs: [ { name: '', type: 'uint256', }, ], payable: false, stateMutability: 'view', type: 'function', }, { payable: true, stateMutability: 'payable', type: 'fallback', }, { anonymous: false, inputs: [ { indexed: true, name: 'owner', type: 'address', }, { indexed: true, name: 'spender', type: 'address', }, { indexed: false, name: 'value', type: 'uint256', }, ], name: 'Approval', type: 'event', }, { anonymous: false, inputs: [ { indexed: true, name: 'from', type: 'address', }, { indexed: true, name: 'to', type: 'address', }, { indexed: false, name: 'value', type: 'uint256', }, ], name: 'Transfer', type: 'event', } ];
    const calls = tokenList.map((token) => {
      const { address: tokenAddress } = token;
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer.value);
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
    let tokenBalances = multicallResponse.returnData; // token balances from multicall

    // Append ETH balance to balance array and token list array
    tokenBalances = [...tokenBalances]; // create new array because otherwise we cannot modify it
    tokenBalances.push(ethResponse.toHexString());
    tokenList.push({
      chainId: 1,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: 'Ether',
      decimals: 18,
      symbol: 'ETH',
      logoURI: 'logos/eth.png',
    });

    // Create array of all tokens with their balance and only keep nonzero ones
    balances.value = tokenList
      .map((token, index) => ({
        ...token,
        balance: ethers.BigNumber.from(tokenBalances[index]),
        amountToSend: 'max',
      }))
      .filter((token) => token.balance.gt(ethers.constants.Zero))
      .sort((token1, token2) => token1.symbol.localeCompare(token2.symbol));
  }

  return {
    provider: computed(() => provider.value),
    signer: computed(() => signer.value),
    userAddress: computed(() => userAddress.value),
    setProvider,
    scan,
    balances: computed(() => balances.value),
  };
}
