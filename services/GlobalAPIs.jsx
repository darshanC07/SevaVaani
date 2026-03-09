import axios from "axios";

export const BASE_URL = "https://4z5zr34t-5000.inc1.devtunnels.ms";

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
export const uploadRecording = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/transcribe`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Audio uploaded successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to upload audio:", err);
    throw err;
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
        user1: user1,
        user1_name: user1_name,
        user2: user2,
        user2_name: user2_name,
      },
      { "Content-Type": "application/json" },
    );
    return response.data;
  } catch (err) {
    console.error("Failed to join call:", err);
  }
};

export const fetchAllJobs = async (lang) => {
  try {
    const response = await axios.get(`${BASE_URL}/${lang}/jobs`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    throw err;
  }
};

export const fetchClientDetails = async (CLIENT_ID, lang) => {
  try {
    const response = await axios.get(`${BASE_URL}/${lang}/client/${CLIENT_ID}`);
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

export const sendProposal = async (
  WORKER_ID,
  WORKER_NAME,
  JOB_ID,
  PROPOSAL_DATA,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/send_proposal`,
      {
        worker_id: WORKER_ID,
        worker_name: WORKER_NAME,
        job_id: JOB_ID,
        proposal_data: PROPOSAL_DATA,
      },
      { "Content-Type": "application/json" },
    );
    return response.data;
  } catch (err) {
    console.error("Failed to send proposal:", err);
    return null;
  }
};

export const sendAcceptJobRequest = async (WORKER_ID, WORKER_NAME, JOB_ID) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/worker_accept_job_req`,
      {
        workerId: WORKER_ID,
        workerName: WORKER_NAME,
        jobId: JOB_ID,
      },
      { "Content-Type": "application/json" },
    );
    return response.data;
  } catch (err) {
    console.error("Failed to accept job:", err);
    return null;
  }
};

export const fetchRequestsOfWorker = async (WORKER_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${lang}/requests/worker/${WORKER_ID}`,
    );
    console.log("error if any:", response?.error);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch requests of worker:", err);
    return null;
  }
};

export const createChat = async (clientUid, workerUid) => {
  try {
    const response = await axios.post(`${BASE_URL}/chat/create`, {
      client_uid: clientUid,
      worker_uid: workerUid,
      role: "worker",
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
      message: message,
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
    const response = await axios.get(
      `${BASE_URL}/chat/${chatId}/messages/since/${timestamp}`,
    );

    return response.data;
  } catch (error) {
    console.error("Get messages since error:", error);

    throw error;
  }
};

export const updateLastSeen = async (userUid) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat/user/${userUid}/last_seen`,
    );

    return response.data;
  } catch (error) {
    console.error("Update last seen error:", error);

    throw error;
  }
};

export const syncData = async (WORKER_ID, DATA) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/sync_data/worker/${WORKER_ID}`,
      {
        data: DATA,
      },
    );
    return response.data;
  } catch (err) {
    console.error("Failed to sync data:", err);
    throw err;
  }
};

export const fetchOngoingJobs = async (WORKER_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/get_ongoing_jobs/worker/${WORKER_ID}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch ongoing jobs:", err);
    return null;
  }
};

export const getChatList = async (WORKER_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${lang}/get_chat_list/worker/${WORKER_ID}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch chat list:", err);
    return null;
  }
};

export const getWalletDetails = async (WORKER_ID, lang) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/${lang}/wallet/worker/${WORKER_ID}`,
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch wallet details:", err);
    return null;
  }
};
