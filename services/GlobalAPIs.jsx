import axios from "axios";



export const BASE_URL = "http://192.168.1.61:5000";



export const UpdateWorkerLoc = async (WORKER_ID, latitude, longitude) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/update_loc/worker/${WORKER_ID}`,

      {

        lat: latitude,

        long: longitude,

      },

      {

        "Content-Type": "application/json",

      },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to send location:", err);

  }

};



export const loginWorker = async (email, password, role) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/login`,

      { email: email, password: password, role: role },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Login failed:", err);

    throw err;

  }

};



export const hangUpCall = async (CALLER_ID) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/hangup_call`,

      { caller_uid: CALLER_ID },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to hang up call:", err);

  }

};



export const joinCall = async (user1, user1_name, user2, user2_name) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/join_call`,

      {

        user1_uid: user1,

        user1_name: user1_name,

        user2_uid: user2,

        user2_name: user2_name,

      },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to join call:", err);

  }

};



// Chat API Functions



export const createChat = async (clientUid, workerUid) => {

  try {

    const response = await axios.post(`${BASE_URL}/chat/create`, {

      client_uid: clientUid,

      worker_uid: workerUid

    });

    return response.data;

  } catch (error) {

    console.error("Create chat error:", error);

    throw error;

  }

};



export const sendMessage = async (chatId, senderUid, recipientUid, message) => {

  try {

    const response = await axios.post(`${BASE_URL}/chat/send`, {

      chat_id: chatId,

      sender_uid: senderUid,

      recipient_uid: recipientUid,

      message: message

    });

    return response.data;

  } catch (error) {

    console.error("Send message error:", error);

    throw error;

  }

};



export const getMessages = async (chatId) => {

  try {

    const response = await axios.get(`${BASE_URL}/chat/${chatId}/messages`);

    return response.data;

  } catch (error) {

    console.error("Get messages error:", error);

    throw error;

  }

};



export const getMessagesSince = async (chatId, timestamp) => {

  try {

    const response = await axios.get(`${BASE_URL}/chat/${chatId}/messages/since/${timestamp}`);

    return response.data;

  } catch (error) {

    console.error("Get messages since error:", error);

    throw error;

  }

};



export const updateLastSeen = async (userUid) => {

  try {

    const response = await axios.post(`${BASE_URL}/chat/user/${userUid}/last_seen`);

    return response.data;

  } catch (error) {

    console.error("Update last seen error:", error);

    throw error;

  }

};



export const fetchAllJobs = async () => {

  try {

    const response = await axios.get(`${BASE_URL}/jobs`);

    return response.data;

  } catch (err) {

    console.error("Failed to fetch jobs:", err);

    throw err;

  }

};



export const fetchClientDetails = async (CLIENT_ID) => {

  try {

    const response = await axios.get(`${BASE_URL}/client/${CLIENT_ID}`);

    return response.data;

  } catch (err) {

    console.error("Failed to fetch client details:", err);

    throw err;

  }

};





export const callUser = async (WORKER_ID, WORKER_NAME, CLIENT_ID) => {

  try {

    const response = await axios.post(

      `${BASE_URL}/call_user`,

      {

        caller_uid: WORKER_ID,

        caller_name: WORKER_NAME,

        callee_uid: CLIENT_ID,

      },

      { "Content-Type": "application/json" },

    );

    return response.data;

  } catch (err) {

    console.error("Failed to call client:", err);

  }

};