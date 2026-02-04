import axios from "axios";

const BASE_URL = "https://30vkdstn-5000.inc1.devtunnels.ms";

export const UpdateWorkerLoc = async (WORKER_ID,latitude,longitude) => {
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
