import { useEffect, useState } from "react"
import alchemylogo from "./assets/alchemylogo.svg"
import {
  helloWorldContract,
  loadCurrentMessage,
  connectWallet,
} from "./utils/interact"

const HelloWorld = () => {
  // State variables
  const [walletAddress, setWalletAddress] = useState("")
  const [status, setStatus] = useState("")
  const [message, setMessage] = useState("No connection to the network.")
  const [newMessage, setNewMessage] = useState("")

  //   Called only once on initial render
  useEffect(() => {
    console.log(helloWorldContract)

    async function fetchMessage() {
      const message = await loadCurrentMessage()
      setMessage(message)
    }

    fetchMessage()
    addSmartContractListener()
  }, [])

  const addSmartContractListener = () => {
    // Set up a listener that watches for the contract's
    // UpdatedMessages event and updates the UI
    helloWorldContract.on("UpdatedMessages", (oldStr, newStr, event) => {
      console.log(oldStr, newStr)
      console.log(event)
      setMessage(newStr)
      setNewMessage("")
      setStatus("Your message has been updated!")
    })
  }

  const addWalletListener = () => {
    // Set up a listener that detects changes in the user's
    // Metamask wallet state, such as when a user disconnects
  }

  const connectWalletPressed = async () => {
    // Function to connect user's Metamask wallet to our dApp
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWalletAddress(walletResponse.address)
  }

  const onUpdatePressed = async () => {
    // function called when user wants to update the message stored in the smart contract
  }

  //   Component UI
  return (
    <div id="container">
      <img id="logo" src={alchemylogo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div>
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
  )
}
export default HelloWorld
