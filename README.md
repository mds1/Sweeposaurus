# Sweeposaurus

<div align="center">
  <p>Say hello to Sweeposaurus. He'll make it easy to sweep all your tokens to a new address!</p>
  <img src="src/assets/app-logo.png" width=300px />
  <p>Start sweeping at <a href="https://sweeposaurus.com/" target="_blank">sweeposaurus.com</a>
</div>

## About

Sweeposaurus is simple. It works as follows:

1. Connect a wallet
1. Scan for all tokens held by your wallet. Right now this is done using CoinGecko's [token list](https://tokenlists.org/token-list?url=https://tokens.coingecko.com/uniswap/all.json), which means it scans for over 1600 tokens!
1. Specify an address to send tokens to, along with the gas price for each transaction.
1. A table is populated showing your balance of each token. An amount column is used change how many of that token to send. Leave the value alone to send the max amount, set it to zero to send nothing, or set it to any other value you want.
1. Click "Send", and you'll get one transaction prompt for each token which will send them to your new address

## Development

If you need to generate new icons, use the command below:

```bash
icongenie generate --mode spa,pwa --icon src/assets/app-logo.png
```

Otherwise, you can get setup for development as follows:

```bash
# Install the dependencies
yarn

# Lint files
yarn run lint

# Run prettier
yarn prettier

# Start the app in web development mode
yarn dev

# Build app for production
yarn build

# Deploy app
yarn deploy
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss the change.
