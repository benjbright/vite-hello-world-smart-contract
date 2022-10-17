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

// export const helloWorldContract

export const loadCurrentMessage = async () => {
  const message = await helloWorldContract.message()
  return message
}

export const connectWallet = async () => {}

export const getCurrentWalletConnected = async () => {}

export const updateMessage = async () => {}
