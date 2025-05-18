import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Footer } from "./sections/Footer"
import { Header } from "./sections/Header"
import AddTimeTrack from "./pages/AddTimeTrack"
import { Body } from "./sections/Body"
import { EmployeesProvider } from "./context/EmployeesContext"
import { User } from "./pages/User"
import { Login } from "./pages/Login"
import { TimeTrackView } from "./pages/TimeTrackView"
import { LogList } from "./pages/LogList"


function App() {
  return (


    <BrowserRouter>
      <EmployeesProvider>
        <div className="flex flex-col min-h-screen  relative  ">
          <div className="absolute top-0 -z-10 h-full w-full bg-white">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(200%_150%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
          </div>

          <Header />
          <Body>
            <Routes>
              <Route path="/" element={<AddTimeTrack />} />
              <Route path="/usuarios" element={
                <User />
              } />
              <Route path="/fichajes" element={<TimeTrackView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/log" element={<LogList />} />
            </Routes>
          </Body>
          <Footer />
        </div>
      </EmployeesProvider>
    </BrowserRouter>
  )
}

export default App

