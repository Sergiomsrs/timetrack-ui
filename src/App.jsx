import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Footer } from "./sections/Footer"
import { Header } from "./sections/Header"
import UserForm from "./components/UserForm"
import AddTimeTrack from "./components/AddTimeTrack"
import { Body } from "./sections/Body"

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <Body>
          <Routes>
            <Route path="/" element={<AddTimeTrack />} />
            <Route path="/usuarios" element={<UserForm />} />
            <Route path="/fichajes" element={<h1>Hola Mundo</h1>} />
          </Routes>
        </Body>
        <Footer />
      </BrowserRouter>


    </div>
  )
}

export default App
