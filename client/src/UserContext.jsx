import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext=createContext({}) //UserContext is created, which initializes a context with empty object as its default value

export default function UserContextProvider({children}){
    const [user,setUser]=useState(null)
    const [ready,setReady]=useState(false)

    useEffect(()=>{
        if (!user){ //if the user is not already set (user is null)
            axios.get("/profile").then(({data})=>{//send a get request to /profile
                setUser(data)
                setReady(true)//indicate then data is ready
            }) 
        }
    },[])
    //wrap child components, making the user, ready and setUser state available to any nested components that consume this context*/
    return (
        <UserContext.Provider value={{user,setUser,ready}}> 
            {children}
        </UserContext.Provider>
    )
}