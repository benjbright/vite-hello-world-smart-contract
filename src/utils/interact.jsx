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

export const getCurrentWalletConnected = async () => {
  // Check if an Ethereum account is already connected
  // to our dApp on page load and update our UI
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      })
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Write a message in the text-field above.",
        }
      } else {
        return {
          address: "",
          status: "Please connect to Metamask",
        }
      }
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

export const updateMessage = async (address, message) => {
  // Update the message stored in the smart contract
  // Make a write call to the smart contract
  // The user's Metamask wallet will have to sign an
  // Ethereum transaction to update the message
  // Need a Provider and a Signer - from Metamask window object
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    }
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    }
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, contractAbi, signer)

  try {
    const tx = await contract.update(message)
    console.log("Updating your message...")
    await tx.wait(2)

    console.log(`Your transaction has been mined: ${tx.hash}`)
    console.log("Transaction confirmed!")
    return {
      status: (
        <span>
          <a href={`https://goerli.etherscan.io/tx/${tx.hash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    }
  } catch (error) {
    return {
      status: "😥 " + error.message,
    }
  }
}
