<template>
  <q-page padding class="text-center">
    <div class="text-h4 q-mb-lg">FAQ</div>

    <q-list class="container text-left" separator>
      <q-expansion-item class="q-py-sm" header-style="font-size: 1.1em;" label="What it Sweeposaurus?">
        <q-card>
          <q-card-section>
            Sweeposaurus is a tool that helps you move all your ETH and ERC-20 tokens from one wallet to another. For
            example, if you want to move all your funds from MetaMask to Ledger, this tool would simplify that process.
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="q-py-sm" header-style="font-size: 1.1em;" label="How does it work?">
        <q-card>
          <q-card-section>
            First your wallet is scanned to check token balances of over
            <a
              href="https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json"
              target="_blank"
              class="hyperlink"
            >
              1600 tokens </a
            >. A table will be shown displaying your balance of each token, with your ETH balance in the last row. You
            can then enter how much of each token to send, along with the address to send funds to. Sweeposaurus will
            queue up each transfer, and all you need to do is confirm each one.
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="q-py-sm"
        header-style="font-size: 1.1em;"
        label="Does this reduce the number of transactions needed?"
      >
        <q-card>
          <q-card-section>
            <p>It does not.</p>
            <p>
              Unless you use a smart contract wallet, there is no way to reduce the number of transactions. This app
              simply makes the process less tedious.
            </p>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="q-py-sm" header-style="font-size: 1.1em;" label="I don't see some of my tokens.">
        <q-card>
          <q-card-section>
            <p>
              If some tokens are missing, it means we don't scan for them. Create an
              <a href="https://github.com/mds1/Sweeposaurus/issues" target="_blank" class="hyperlink">issue</a> with the
              missing token name(s). If you have the token addresses also, that is preferred.
            </p>
            <p>
              If you are not a GitHub user, feel free to message me on
              <a href="https://twitter.com/msolomon44" target="_blank" class="hyperlink">Twitter</a> with the above
              info.
            </p>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="q-py-sm" header-style="font-size: 1.1em;" label="Can you add support for feature X?">
        <q-card>
          <q-card-section>
            <p>
              Maybe! Create an
              <a href="https://github.com/mds1/Sweeposaurus/issues" target="_blank" class="hyperlink">issue</a> with the
              feature details.
            </p>
            <p>
              If you are not a GitHub user, feel free to message me on
              <a href="https://twitter.com/msolomon44" target="_blank" class="hyperlink">Twitter</a> with the feature
              request.
            </p>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="q-py-sm"
        header-style="font-size: 1.1em;"
        label="I used a gas price that's too low and my transfers are stuck. Help!"
      >
        <q-card>
          <q-card-section>
            You can use the
            <a href="https://cancel-ethereum-transactions.web.app/" target="_blank" class="hyperlink"
              >Cancel Ethereum Transactions</a
            >
            application to cancel or speed up your tansfers.
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="q-py-sm" header-style="font-size: 1.1em;" label="Where can I see the code?">
        <q-card>
          <q-card-section>
            The GitHub repository is
            <a href="https://github.com/mds1/Sweeposaurus" target="_blank" class="hyperlink">here</a>. The code for
            transaction generation can be found in
            <a
              href="https://github.com/mds1/Sweeposaurus/blob/main/src/pages/Sweep.vue"
              target="_blank"
              class="hyperlink"
            >
              this file </a
            >.
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PageFAQ',
});
</script>
