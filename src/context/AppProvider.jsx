import { useState } from "react"
import { AppContext } from "./AppContext"

export const AppProvider = ({children})=> {

    const [selectedOption, setSelectedOption] = useState('todos');
    const [count, setCount] = useState(0)

    return(
        <AppContext.Provider value={{
            
            selectedOption, 
            count,
          
            
       
            setSelectedOption,
            setCount
       
        }}>
            {children}
        </AppContext.Provider>
    )
}



/* 
Para utilizarlo --> const {} = useContext(AppContext)
 */