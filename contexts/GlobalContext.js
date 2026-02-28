import React, { createContext, useState } from "react";

export const GlobalStatesContext = createContext({
  messages : [],
  setMessages : ([messages])=>{},
  jobs : [],
  setJobs : ()=>{},
  isOnline : true,
  setIsOnline : (status)=>{},
  isIemodelLoaded : false,
  setIeModel : ()=>{},
  notifications : [],
  setNotifications : ([])=>{}

});

export const GlobalStatesProvider = ({ children }) => {
  const [messages,setMessages] = useState([])
  const [notifications,setNotifications] = useState([])
  const [jobs,setJobs] = useState([])
  const [isOnline, setIsOnline] = useState(true);
  const [isIemodelLoaded,setIeModel] = useState(false)
    return (
        <GlobalStatesContext.Provider value={{ messages, setMessages,notifications,setNotifications,jobs,setJobs,isOnline,setIsOnline,isIemodelLoaded,setIeModel }}>
            {children}
        </GlobalStatesContext.Provider>
    );
}