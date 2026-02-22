import React, { createContext, useState } from "react";

export const GlobalStatesContext = createContext({
  messages : [],
  setMessages : ()=>{},
  jobs : [],
  setJobs : ()=>{},
  isOnline : true,
  setIsOnline : (status)=>{}
});

export const GlobalStatesProvider = ({ children }) => {
  const [messages,setMessages] = useState([])
  const [jobs,setJobs] = useState([])
  const [isOnline, setIsOnline] = useState(true);
    return (
        <GlobalStatesContext.Provider value={{ messages, setMessages,jobs,setJobs,isOnline,setIsOnline }}>
            {children}
        </GlobalStatesContext.Provider>
    );
}
