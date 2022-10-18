import contractAbi from "./contract-abi.json"
import { ethers } from "ethers"

const VITE_API_KEY = import.meta.env.VITE_API_KEY
const contractAddress = "0x83f4E84354AB2FaDfe464c8d24871A11d1832201"

const provider = new ethers.providers.AlchemyProvider("goerli", VITE_API_KEY)

export const helloWorldContract = new ethers.Contract(
  contractAddress,
  contractAbi,
  provider
)

export const loadCurrentMessage = async () => {
  // Make a read call to the smart contract
  // using the AlchemyProvider and API key
  // Load the current message stored in the smart contract
  const message = await helloWorldContract.message()
  return message
}

export const connectWallet = async () => {
  // Connect the user's Metamask wallet to our dApp
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const obj = {
        status: "Write a message in the text-field above.",
        address: addressArray[0],
      }
      return obj
    } catch (error) {
      return {
        address: "",
        status: error.message,
      }
    }
  } else {
    return {
      address: "",
      status:
        "Please install Metamask, a virtual ethereum wallet, in your browser.  https://metamask.io/download",
    }
  }
}

export const getCurrentWalletConnected = async () => {}

export const updateMessage = async () => {}
