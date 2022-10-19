# vite-hello-world-smart-contract

Alchemy Hello World smart contract project - front end Vite / React

The deployed app is hosted on Vercel - https://vite-hello-world-smart-contract.vercel.app/

## Notes and key learning points

### useEffect hook

- a React hook that is called after the component is rendered. If it has an empty array prop passed into it, will only be called on the component's first render.
- In this project we will load the current message stored in the smart contract, call our smart contract and wallet listeners and then update our UI to reflect whether a wallet is already connected.

### M-V-C

- (Model - View - Controller) paradigm
- use a seperate file to contain all the functions to manage the logic, data and rules of our dApp
- then export those functions to our front-end (HelloWorld component)

### Read from a smart contract

- To read from a smart contract need the following:
  1. An API connection to the Ethereum blockchain
  2. A loaded instance of your smart contract
  3. A function to call your smart contract function
  4. A listener to watch for updates when the data you're reading from the smart contract changes

### Install the Alchemy Web3 API

- Need an Alchemy Web3 key in our dApp to read from the blockchain
- run `npm install @alch/alchemy-web3`
- Alchemy Web3 is a wrapper around Web3.js which provides enhanced API methods
- install the `dotenv` package - `npm install dotenv --save`
- use the Alchemy Websockets API key instead of HTTP API key as this will allow us to set up a listener that detects when the message stored in the smart contract changes
- use the API key to establish the Alchemy Web3 endpoint

### Load instance of your smart contract

- to load your smart contract, need the following:
  1. Contract address
  2. Contract ABI
- Both can be found on Etherscan as previously verified the contract
- Contract ABI is necessary for specifying which function a contract will invoke as well as ensuring the function will return data in the correct format.
- Copy the ABI and save as a JSON file in `contract-abi.json`
