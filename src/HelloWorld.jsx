import { useEffect, useState } from "react"
import alchemylogo from "./assets/alchemylogo.svg"
import {
  helloWorldContract,
  loadCurrentMessage,
  connectWallet,
  getCurrentWalletConnected,
  updateMessage,
} from "./utils/interact"
import { Message, Icon } from "semantic-ui-react"

const HelloWorld = () => {
  // State variables
  const [walletAddress, setWalletAddress] = useState("")
  const [status, setStatus] = useState("")
  const [message, setMessage] = useState("No connection to the network.")
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)

  //   Called only once on initial render
  useEffect(() => {
    // console.log(helloWorldContract)

    async function fetchMessage() {
      const message = await loadCurrentMessage()
      setMessage(message)
    }
    fetchMessage()

    addSmartContractListener()

    async function fetchWallet() {
      const { address, status, connected } = await getCurrentWalletConnected()
      setWalletAddress(address)
      setStatus(status)
      setConnected(connected)
    }
    fetchWallet()
    addWalletListener()
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
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setStatus("Write a message in the text-field above.")
          setConnected(true)
        } else {
          setWalletAddress("")
          setStatus("Please connect to Metamask.")
          setConnected(false)
        }
      })
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download`}>
            Please install Metamask, a virtual Ethereum wallet, in your browser.
          </a>
        </p>
      )
    }
  }

  const connectWalletPressed = async () => {
    // Function to connect user's Metamask wallet to our dApp
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWalletAddress(walletResponse.address)
  }

  const onUpdatePressed = async () => {
    // function called when user wants to update the message stored in the smart contract
    setLoading(true)
    setStatus("Waiting for block confirmation...")
    const { status } = await updateMessage(walletAddress, newMessage)
    setStatus(status)
    setLoading(false)
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
        {/* <p id="status">{status}</p> */}
        <Message icon>
          {loading && <Icon name="circle notched" loading />}
          <Message.Content>
            <Message.Header>
              {connected ? "Welcome to Web3!" : "Please connect your Metamask"}
            </Message.Header>
            {connected ? status : ""}
          </Message.Content>
        </Message>

        <button id="publish" onClick={onUpdatePressed}>
          Update
        </button>
      </div>
    </div>
  )
}
export default HelloWorld
