import { createContext, useContext, useState } from "react";

const StateContext =createContext({
    user:null,
    token:null,
    tags:null,
    services:null,
    setUser:()=>{},
    settags:()=>{},
    setToken:()=>{} ,   
    setservices:()=>{}
})
export const ContextProvider = ({children}) => {
    const [user,setUser]=useState({
    });
    const [tags,settags]=useState({
    });
    const [services,setservices]=useState({
    });
    const [token,_setToken]=useState(localStorage.getItem('ACESS_TOKEN'));
const setToken=(token)=>{
    _setToken(token);
    if(token)
    {
        localStorage.setItem('ACESS_TOKEN',token);
    }else{
        localStorage.removeItem('ACESS_TOKEN');
    }
}
    return ( <StateContext.Provider value={{
        user,
        token,
        tags,
        services,
        setUser,
        setToken,
        settags, 
        setservices
    }}>
{children}
    </StateContext.Provider> );
}
export const useStateContext =() => useContext(StateContext)



