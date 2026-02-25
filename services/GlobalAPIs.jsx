import axios from "axios";



export const BASE_URL = "http://192.168.137.1:5000";

export const createRazorpayOrder = async (amount, notes = null) => {
  try {
    const response = await fetch(`${BASE_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        amount,
        notes: notes || undefined
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Create order failed: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Create Razorpay order failed:", err);
    throw err;
  }
};

export const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
  try {
    const response = await fetch(`${BASE_URL}/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || data?.status || "Verification failed");
    }
    return data;
  } catch (err) {
    console.error("Verify Razorpay payment failed:", err);
    throw err;
  }
};



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



// Test function to debug POST requests
export const testPostRequest = async () => {
  try {
    console.log("🧪 testPostRequest: Testing POST request with Axios");
    const response = await axios.post(`${BASE_URL}/test-post`, {
      test: "Hello from React Native",
      timestamp: Date.now()
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log("🧪 testPostRequest: Axios Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ testPostRequest: Axios Error:", error);
    
    // Try with fetch as fallback
    try {
      console.log("🧪 testPostRequest: Testing POST request with Fetch");
      const fetchResponse = await fetch(`${BASE_URL}/test-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          test: "Hello from React Native Fetch",
          timestamp: Date.now()
        })
      });
      const data = await fetchResponse.json();
      console.log("🧪 testPostRequest: Fetch Response:", data);
      return data;
    } catch (fetchError) {
      console.error("❌ testPostRequest: Fetch Error:", fetchError);
      throw fetchError;
    }
  }
};



export const createChat = async (clientUid, workerUid) => {
  try {
    console.log("💬 createChat: Creating chat between client:", clientUid, "and worker:", workerUid);
    console.log("💬 createChat: Making request to:", `${BASE_URL}/chat/create`);
    
    // Use fetch instead of Axios to fix POST request issue
    const response = await fetch(`${BASE_URL}/chat/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_uid: clientUid,
        worker_uid: workerUid
      })
    });

    const data = await response.json();
    console.log("💬 createChat: Response:", data);
    return data;

  } catch (error) {
    console.error("❌ createChat: Error:", error);
    throw error;
  }
};



export const sendMessage = async (chatId, senderUid, recipientUid, message) => {
  try {
    console.log("📤 sendMessage: Sending message to chat:", chatId);
    console.log("📤 sendMessage: Parameters:", { chatId, senderUid, recipientUid, message });
    
    // Validate parameters
    if (!chatId || chatId === 'undefined' || chatId === 'null') {
      console.error("❌ sendMessage: Invalid chatId:", chatId);
      throw new Error("Invalid chatId");
    }
    
    if (!senderUid || senderUid === 'undefined' || senderUid === 'null') {
      console.error("❌ sendMessage: Invalid senderUid:", senderUid);
      throw new Error("Invalid senderUid");
    }
    
    if (!recipientUid || recipientUid === 'undefined' || recipientUid === 'null') {
      console.error("❌ sendMessage: Invalid recipientUid:", recipientUid);
      throw new Error("Invalid recipientUid");
    }
    
    if (!message || message.trim() === '') {
      console.error("❌ sendMessage: Invalid message:", message);
      throw new Error("Invalid message");
    }

    const url = `${BASE_URL}/chat/send`;
    console.log("📤 sendMessage: Making request to:", url);
    
    const requestBody = {
      chat_id: chatId,
      sender_uid: senderUid,
      recipient_uid: recipientUid,
      message: message.trim()
    };
    
    console.log("📤 sendMessage: Request body:", requestBody);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log("📤 sendMessage: Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ sendMessage: HTTP Error:", response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ sendMessage: Response:", data);
    return data;

  } catch (error) {
    console.error("❌ Send message error:", error);
    console.error("❌ Send message error details:", error.message);
    throw error;
  }
};



export const getMessages = async (chatId) => {
  try {
    console.log("📨 Worker getMessages: Fetching messages for chat:", chatId);

    const response = await axios.get(`${BASE_URL}/chat/${chatId}/messages`);

    console.log("📨 Worker getMessages: Response:", response.data);

    return response.data;

  } catch (error) {

    console.error("❌ Worker getMessages error:", error);

    throw error;

  }

};



export const getMessagesSince = async (chatId, timestamp) => {
  try {
    console.log("🔍 getMessagesSince: chatId=", chatId, "timestamp=", timestamp);
    
    // Validate parameters
    if (!chatId || chatId === 'undefined' || chatId === 'null') {
      console.error("❌ getMessagesSince: Invalid chatId:", chatId);
      return { messages: [] };
    }
    
    if (!timestamp || timestamp === 'undefined' || timestamp === 'null') {
      console.error("❌ getMessagesSince: Invalid timestamp:", timestamp);
      return { messages: [] };
    }
    
    const url = `${BASE_URL}/chat/${chatId}/messages/since/${timestamp}`;
    console.log("🔍 getMessagesSince: Making request to:", url);
    
    const response = await axios.get(url);
    console.log("✅ getMessagesSince: Response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get messages since error:", error);
    console.error("Get messages since error details:", error.response?.data);
    // Return empty messages array on error to prevent infinite loops
    return { messages: [] };
  }
};



export const updateLastSeen = async (userUid) => {

  try {

    console.log("👁️ updateLastSeen: Updating last seen for user:", userUid);

    const response = await fetch(`${BASE_URL}/chat/user/${userUid}/last_seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    console.log("✅ updateLastSeen: Response:", data);
    return data;

  } catch (error) {

    console.error("❌ Update last seen error:", error);
    throw error;

  }

};



export const fetchAllJobs = async () => {

  try {

    console.log("📨 Worker fetchAllJobs: Fetching all jobs");
    console.log("📨 Worker fetchAllJobs: BASE_URL:", BASE_URL);
    console.log("📨 Worker fetchAllJobs: Making request to:", `${BASE_URL}/jobs`);

    const response = await axios.get(`${BASE_URL}/jobs`);

    console.log("📨 Worker fetchAllJobs: Response received");
    return response.data;

  } catch (err) {

    console.error("❌ Worker fetchAllJobs: Failed to fetch jobs:", err);
    
    if (err.response) {
      console.error("❌ Worker fetchAllJobs: Response status:", err.response.status);
      console.error("❌ Worker fetchAllJobs: Response data:", err.response.data);
    }

    throw err;

  }

};



export const fetchClientDetails = async (CLIENT_ID) => {

  try {

    console.log("🔍 Worker fetchClientDetails: Fetching details for client:", CLIENT_ID);

    const url = `${BASE_URL}/client/${CLIENT_ID}`;

    console.log("🔍 Worker fetchClientDetails: Making request to:", url);

    const response = await axios.get(url);

    console.log("🔍 Worker fetchClientDetails: Response:", response.data);

    return response.data;

  } catch (err) {

    console.error("❌ Worker fetchClientDetails error:", err);

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
