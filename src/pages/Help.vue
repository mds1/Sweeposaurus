<template>
  <q-page padding class="text-center">
    <div class="text-h4 q-mb-lg">
      Help
    </div>

    <q-list class="container text-left" separator>
      <q-expansion-item
        class="q-py-sm"
        header-style="font-size: 1.1em;"
        label="Why can't I cancel or speed up my transaction?"
      >
        <q-card>
          <q-card-section>
            First make sure you are using a high enough gas price. Use fastest speed shown on
            <a href="https://ethgasstation.info/" target="_blank" class="hyperlink"
              >ETH Gas Station</a
            >, and if that doesn't work try something a little higher. Note that not all wallets let
            you change the gas price, such as Coinbase Wallet. <br /><br />
            If you are using a high enough gas price (which you will be if using this app's default
            gas price) the issue is almost always due to using the wrong nonce. See
            <span class="text-italic">What nonce should I use?</span> below for more information on
            how to resolve this.
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="q-py-sm"
        expand-separator
        header-style="font-size: 1.1em;"
        label="What nonce should I use?"
      >
        <q-card>
          <q-card-section>
            Every Ethereum transaction has a nonce. Every time you send a transaction, the nonce
            must be one higher than your last successful transaction. Your wallet typically manages
            the nonce for you, but sometimes this can cause issues if you have pending transactions
            that are stuck.<br /><br />
            To fix this, you need to manually set the nonce for your cancellation or speed-up
            transaction, which you can do by the following the steps below:
            <ol>
              <li>
                Go to
                <a href="https://etherscan.io/" target="_blank" class="hyperlink">Etherscan</a> and
                search for your address. Use this as your source of truth to know how many
                transactions are pending.
              </li>
              <li>
                Find the last successful transaction, click
                <span class="text-italic">Click to see more</span>, and make a note of the nonce.
                The next transaction you send must be one higher than this value. If your last
                successful transaction has a nonce of 47, your next transaction must have a nonce of
                48.
              </li>
              <li>
                Send your cancellation or speed-up transaction from this app and make sure to set
                the nonce to correct value. In our example here, this means set it to 48.
              </li>
              <li>
                If you have multiple pending transactions, those may or may not automatically be
                processed now. If they were sent with a high enough gas price, they will go through
                and you may be done. If they also had a gas price that was too low, repeat the above
                steps until all transactions are cancelled. You are done when Etherscan shows that
                you have no more pending transactions.
              </li>
            </ol>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="q-py-sm"
        expand-separator
        header-style="font-size: 1.1em;"
        label="How do I speed up my transaction?"
      >
        <q-card>
          <q-card-section>
            Get your transaction hash and paste it into the box shown on the Speed Up page. Click
            the button to send your transactin and you should be all set. If it says
            <span class="text-italic">Transaction not found</span>, click the link that says
            <span class="text-italic">Use manual approach</span> and follow the steps below:

            <ol>
              <li>
                Go to
                <a href="https://etherscan.io/" target="_blank" class="hyperlink">Etherscan</a> and
                search for your transaction hash.
              </li>
              <li>
                Once viewing your transaction, click
                <span class="text-italic">Click to see more</span>. Next we will copy over various
                parameters from Etherscan into our form.
              </li>
              <li>
                Copy the address shown in the <span class="text-italic">To</span> field and paste it
                in the form.
              </li>
              <li>
                Copy the gas limit shown in the <span class="text-italic">Gas Limit</span> field and
                paste it in the form. Please remove the thousands separator. For example, enter
                300,000 as 300000.
              </li>
              <li>
                Find the field labeled <span class="text-italic">Input Data</span> on Etherscan.
                Click the button that says <span class="text-italic">View Input As</span> and select
                <span class="text-italic">Original</span>. You should see a hexadecimal string that
                starts with 0x. Copy that and paste it into the
                <span class="text-italic">Data</span> field.
              </li>
              <li>
                In the field labeled <span class="text-italic">Value</span> and copy the exact
                amount of Ether into the <span class="text-italic">Value</span>
                field.
              </li>
              <li>
                Copy the number from the <span class="text-italic">Nonce</span> field and paste it
                in the nonce box. Make sure to click
                <span class="text-italic">Show advanced settings</span>
                to reveal this field. See the
                <span class="text-italic">What nonce should I use?</span> question above to make
                sure you use the correct nonce.
              </li>
              <li>Done! You can now send your transaction.</li>
            </ol>
            There are a few things to be aware of when speeding up a transaction:
            <ul>
              <li>
                You may not want to use this functionality to speed up trades, such as token swaps
                on Uniswap. If prices have changed since the transaction was originally sent, the
                new transaction may fail if it's identical. This is done by Uniswap and other
                applications to protect you from executing a swap at a bad price that you may not
                have wanted.
              </li>
              <li>
                If your transaction required a very specific amount of Ether to be sent, there is a
                chance the transaction will fail because Etherscan may not be showing the full
                amount of decimal places.
              </li>
              <li>
                If you think either of the above cases applies to you, you may want to cancel your
                original transaction and then send a new one instead of speeding up the existing
                one.
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="q-py-sm"
        expand-separator
        header-style="font-size: 1.1em;"
        label="I'm having issues with MetaMask"
      >
        <q-card>
          <q-card-section>
            The most common issue with MetaMask is that if you try to change the nonce through this
            app, MetaMask will
            <a
              href="https://docs.metamask.io/guide/sending-transactions.html#transaction-parameters"
              target="_blank"
              class="hyperlink"
              >ignore it</a
            >. The solution is set the nonce manually within MetaMask before sending the
            transaction, which you can do as follows:
            <ol>
              <li>
                Open MetaMask and navigate to <span class="text-italic">Settings</span> >
                <span class="text-italic">Advanced</span>
              </li>
              <li>
                Scroll to the option called
                <span class="text-italic">Customize transaction nonce</span> and turn it on
              </li>
              <li>
                Now when you send transactions, there will be an option to change the nonce before
                sending it.
              </li>
              <li>
                See the <span class="text-italic">What nonce should I use?</span> question above to
                ensure you use the correct nonce.
              </li>
            </ol>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        class="q-py-sm"
        expand-separator
        header-style="font-size: 1.1em;"
        label="I'm having issues with Coinbase Wallet"
      >
        <q-card>
          <q-card-section>
            The most common issue with Coinbase Wallet is being unable to cancel or speed-up a
            transaction due to these transactions being sent with an incorrect nonce. To resolve
            this:
            <ol>
              <li>
                Go to
                <a href="https://etherscan.io/" target="_blank" class="hyperlink">Etherscan</a> and
                search for your address. Use this as your source of truth to know how many
                transactions are pending.
              </li>
              <li>
                Open Coinbase Wallet and navigate to
                <span class="text-italic">
                  Settings > Advanced Settings > Clear Pending Transactions
                </span>
              </li>
              <li>Send your cancellation or speed-up transaction</li>
              <li>Repeat the above steps until you have no more pending transactions</li>
            </ol>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'PageHelp',
});
</script>
