'use client'

import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

//creating a context by the name of Socketcontext
const SocketContext = createContext(null);

//socketProvider to wrap the whole app inside it
export const SocketProvider = (props) => {

    //using useMemo hook so that socket is created only once per user
    const socket = useMemo( () => io('localhost:8000') , [])

    return (

        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>

    )

}


//custom hook to use the socket easily in every component 
export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}