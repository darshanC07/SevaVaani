import React, { createContext, useState } from "react";
import { Job } from "../types";

interface GlobalStatesContextType {
  messages: any[];
  setMessages: (messages: any[]) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
}

export const GlobalStatesContext = createContext<GlobalStatesContextType>({
  messages : [],
  setMessages : ()=>{},
  jobs : [],
  setJobs : (jobs)=>{}
});

export const GlobalStatesProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<any[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
    return (
        <GlobalStatesContext.Provider value={{ messages, setMessages, jobs, setJobs }}>
            {children}
        </GlobalStatesContext.Provider>
    );
}
