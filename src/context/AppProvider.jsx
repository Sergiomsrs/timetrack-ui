import { useState } from "react"
import { AppContext } from "./AppContext"

export const AppProvider = ({children})=> {

    const [selectedOption, setSelectedOption] = useState('todos');
    const [count, setCount] = useState(0)
    const [authUser, setAuthUser] = useState(null)

    return(
        <AppContext.Provider value={{
            
            selectedOption, 
            count,
            authUser,
          
            
       
            setSelectedOption,
            setCount,
            setAuthUser
       
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */