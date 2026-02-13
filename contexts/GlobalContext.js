import React, { createContext, useState } from "react";

export const GlobalStatesContext = createContext({
  messages : [],
  setMessages : ()=>{},
  jobs : [],
  setJobs : ()=>{}
});

export const GlobalStatesProvider = ({ children }) => {
  const [messages,setMessages] = useState([])
  const [jobs,setJobs] = useState([])
    return (
        <GlobalStatesContext.Provider value={{ messages, setMessages,jobs,setJobs }}>
            {children}
        </GlobalStatesContext.Provider>
    );
}
