import React, { createContext, useState, useEffect } from "react";
import { Job } from "../types";
import { fetchAllJobs } from "../services/GlobalAPIs";
import { getUserId } from "../utils/AsyncStorageUtils";

interface Message {
  message_id: string;
  from: string;
  to: string;
  msg: string;
  timestamp: number;
}

interface Chat {
  chat_id: string;
  client_uid: string;
  worker_uid: string;
  messages: Message[];
}

interface GlobalStatesContextType {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  activeClients: any[];
  setActiveClients: (clients: any[]) => void;
  refreshJobs: () => Promise<void>;
  loadUserChats: () => Promise<void>;
  addNewMessage: (message: Message) => void;
}

export const GlobalStatesContext = createContext<GlobalStatesContextType>({
  messages: [],
  setMessages: () => { },
  chats: [],
  setChats: () => { },
  jobs: [],
  setJobs: (jobs) => { },
  isConnected: false,
  setIsConnected: () => { },
  activeClients: [],
  setActiveClients: () => { },
  refreshJobs: async () => {},
  loadUserChats: async () => {},
  addNewMessage: () => {}
});

export const GlobalStatesProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeClients, setActiveClients] = useState<any[]>([]);

  // Function to refresh jobs from API
  const refreshJobs = async () => {
    try {
      const jobsData = await fetchAllJobs();
      if (jobsData && jobsData.jobs) {
        setJobs(jobsData.jobs);
      }
      setIsConnected(true);
    } catch (error) {
      console.error("❌ Worker GlobalContext: Error refreshing jobs:", error);
      setIsConnected(false);
    }
  };

  // Function to load user's chats
  const loadUserChats = async () => {
    try {
      const userId = await getUserId();
      if (!userId) return;

      console.log("🔄 Worker GlobalContext: Loading chats for user:", userId);
      
      // This would need a backend endpoint to get user's chat list
      // For now, we'll initialize with empty chats
      setChats([]);
      setIsConnected(true);
    } catch (error) {
      console.error("❌ Worker GlobalContext: Error loading chats:", error);
      setIsConnected(false);
    }
  };

  // Function to add new message (for real-time updates)
  const addNewMessage = (message: Message) => {
    console.log("📨 Worker GlobalContext: Adding new message:", message);
    setMessages(prev => [...prev, message]);
    
    // Also update the corresponding chat if needed
    setChats(prev => prev.map(chat => {
      if (chat.chat_id === message.message_id.split('_')[0]) {
        return {
          ...chat,
          messages: [...chat.messages, message]
        };
      }
      return chat;
    }));
  };

  // Initial load and periodic refresh
  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        refreshJobs(),
        loadUserChats()
      ]);
    };
    
    initializeApp();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(refreshJobs, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("🔄 Worker GlobalContext: Messages updated:", messages.length);
  }, [messages]);

  useEffect(() => {
    console.log("🔄 Worker GlobalContext: Jobs updated:", jobs.length);
  }, [jobs]);

  useEffect(() => {
    console.log("🔄 Worker GlobalContext: Chats updated:", chats.length);
  }, [chats]);

  return (
    <GlobalStatesContext.Provider value={{
      messages,
      setMessages,
      chats,
      setChats,
      jobs,
      setJobs,
      isConnected,
      setIsConnected,
      activeClients,
      setActiveClients,
      refreshJobs,
      loadUserChats,
      addNewMessage
    }}>
      {children}
    </GlobalStatesContext.Provider>
  );
};
