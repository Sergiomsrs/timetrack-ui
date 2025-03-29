import { Body } from "./sections/Body"
import { Footer } from "./sections/Footer"
import { Header } from "./sections/Header"

function App() {

  return (
    <div className="flex flex-col min-h-screen">
    <Header />
    <Body/>
    <Footer />
  </div>
  )
}

export default App
