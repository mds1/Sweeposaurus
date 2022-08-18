<template>
  <div @click="connectWallet">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api';
import { Dark } from 'quasar';
import useWalletStore from 'src/store/wallet';
import Onboard from 'bnc-onboard';
import { getAddress } from '@ethersproject/address';

function useWallet(context: SetupContext, redirectTo: string) {
  const { setProvider, userAddress, chainId } = useWalletStore();

  async function connectWallet() {
    const rpcUrl = `https://mainnet.infura.io/v3/${String(process.env.INFURA_ID)}`;

    // Define available wallets
    const wallets = [
      { walletName: 'metamask', preferred: true },
      { walletName: 'coinbase', preferred: true },
      { walletName: 'torus' },
      { walletName: 'ledger', rpcUrl },
      { walletName: 'trezor', appUrl: 'https://sweeposaurus.com/sweep', email: 'matt@mattsolomon.dev', rpcUrl },
      { walletName: 'fortmatic', apiKey: process.env.FORTMATIC_API_KEY },
      { walletName: 'portis', apiKey: process.env.PORTIS_API_KEY },
      { walletName: 'authereum' },
      { walletName: 'walletConnect', infuraKey: process.env.INFURA_ID, preferred: true },
      { walletName: 'trust', rpcUrl },
      { walletName: 'dapper' },
      { walletName: 'walletLink', rpcUrl, label: 'Coinbase Wallet (WalletLink)' },
      { walletName: 'opera' },
      { walletName: 'operaTouch' },
      { walletName: 'status' },
      { walletName: 'unilogin' },
      { walletName: 'imToken', rpcUrl },
      { walletName: 'meetone' },
      { walletName: 'mykey', rpcUrl },
      { walletName: 'huobiwallet', rpcUrl },
    ];

    // Define wallet check modules
    const walletChecks = [
      { checkName: 'connect' },
      { checkName: 'derivationPath' },
      { checkName: 'accounts' },
      { checkName: 'balance', minimumBalance: '1' }, // make sure user has at least 1 wei
    ];

    // Connect wallet
    const onboard = Onboard({
      dappId: process.env.BLOCKNATIVE_API_KEY,
      darkMode: Dark.isActive,
      networkId: 1,
      walletCheck: walletChecks,
      walletSelect: { wallets: wallets },
      subscriptions: {
        wallet: async (wallet) => {
          if (wallet.connect) {
            await wallet.connect();
          }
          await setProvider(wallet.provider);
        },
        // Refresh on address/network change for safety.
        address: (address) => {
          if (address && userAddress.value && userAddress.value !== getAddress(address)) {
            window.location.reload();
          }
        },
        network: (newChainId) => {
          if (chainId.value && chainId.value !== newChainId) {
            window.location.reload();
          }
        },
      },
    });
    await onboard.walletSelect();
    await onboard.walletCheck();

    // Redirect to specified page
    await context.root.$router.push({ name: redirectTo });
  }

  return { connectWallet };
}

export default defineComponent({
  name: 'ConnectWallet',

  props: {
    // Page name to redirect to after logging in
    redirectTo: {
      type: String,
      required: true,
    },
  },

  setup(props, context) {
    return { ...useWallet(context, props.redirectTo) };
  },
});
</script>
