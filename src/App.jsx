import { useState } from "react"
import reactLogo from "./assets/react.svg"
import "./App.css"
import HelloWorld from "./HelloWorld"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <HelloWorld />
    </div>
  )
}

export default App
