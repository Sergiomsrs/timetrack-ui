import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Footer } from "./sections/Footer"
import { Header } from "./sections/Header"
import UserForm from "./components/UserForm"
import AddTimeTrack from "./components/AddTimeTrack"
import { Body } from "./sections/Body"
import { Tabla } from "./components/Tabla"

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <Body>
          <Routes>
            <Route path="/" element={<AddTimeTrack />} />
            <Route path="/usuarios" element={<UserForm />} />
            <Route path="/fichajes" element={<Tabla/>} />
          </Routes>
        </Body>
        <Footer />
      </BrowserRouter>


    </div>
  )
}

export default App
