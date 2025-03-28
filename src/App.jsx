import { useContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AppContext } from './context/AppContext'

function App() {
  const {count, setCount} = useContext(AppContext)

  return (
    <div>
      <h1>Hola Mundo timeTrack</h1>
    </div>
  )
}

export default App
