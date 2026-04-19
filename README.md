# Problem

In India, millions of blue-collar workers, such as carpenters, plumbers, electricians, and painters, rely on word of mouth to find jobs, while individuals struggle to quickly connect with trustworthy, available workers.

# Solution

https://github.com/user-attachments/assets/89202974-880a-44a3-b2e7-ef312d5ca588


SevaVaani is a dual-role, voice-first, multilingual platform that enables clients to post jobs through simple voice interactions with an AI assistant, while allowing blue-collar workers (such as plumbers and electricians) to easily access and manage work opportunities.

## Voice-First, Multilingual, Always Accessible
Our smart worker dashboard enables blue-collar professionals to receive jobs, respond instantly using voice, and work seamlessly and even without internet connectivity.

### Features :

- Real-Time Job Alerts
- Voice Reply & One-Tap Quotes
- Language Preference Mode
- Secure OTP Verification with Aadhaar card
- Earnings Dashboard

Online / Offline mode with data synchronization
1. Ready Mode
- Visible to matching algorithm.
- Receive real-time job notifications & voice calls.
2. Offline Mode
- Update profiles, add skills, review job history
- Everything syncs automatically when back online.


## Demo

<table>
  <tr>
    <td>
      <video src="https://github.com/user-attachments/assets/774ac8c5-c16f-4ba8-a87f-b0110e97f118" controls width="100%"></video>
    </td>
    <td>
      <video src="https://github.com/user-attachments/assets/89dfb4e3-798f-45fe-be04-e8fcce55ecf3" controls width="100%"></video>
    </td>
    <td>
      <video src="https://github.com/user-attachments/assets/4ce8dc24-f548-4b85-a75b-fd7c28772d83" controls width="100%"></video>
    </td>
  </tr>

  <tr>
    <td>
      <video src="https://github.com/user-attachments/assets/58f74415-63db-4a2a-810e-a09c2ef29a1f" controls width="100%"></video>
    </td>
    <td>
      <video src="https://github.com/user-attachments/assets/8731ff1b-23d9-45eb-8d41-72842ead30c8" controls width="100%"></video>
    </td>
    <td>
      <video src="https://github.com/user-attachments/assets/aaf5f596-4c01-46fb-9ac2-74579ab41175" controls width="100%"></video>
    </td>
  </tr>

  <tr>
    <td colspan="3" align="center">
      <video src="https://github.com/user-attachments/assets/f01f3dbe-2210-4fc7-bb0a-8f9cbc96cfb6" controls width="40%"></video>
    </td>
  </tr>
</table>

## Performance Optimization – Sevavaani Worker & Backend

### Previous Approach & Issues

The initial implementation of the Sevavaani Worker application and its backend followed a largely synchronous and unoptimized data-fetching pattern, which introduced multiple performance bottlenecks:

- **Redundant Database Queries**  
  Multiple endpoints (e.g., `getAllJobs`, `get-chatlist`) performed repeated database calls for the same data, increasing latency and server load.

- **Over-fetching of Data**  
  APIs frequently retrieved complete datasets even when only partial information (e.g., client name) was required, leading to unnecessary payload size and processing overhead.

- **Synchronous Event Handling**  
  Worker processes were blocked due to synchronous execution (e.g., `.get(25)`), causing delays and leading hosting platforms to misinterpret workers as unresponsive and restart them.

- **Inefficient Initial Rendering**  
  React components triggered duplicate API calls due to improper dependency handling in `useEffect`, resulting in redundant network traffic and slower UI load times.

- **Repeated Navigation Stack Growth**  
  Navigation logic allowed pushing the same screen multiple times, increasing memory usage and degrading user experience.

- **High Latency Search Operations**  
  Search functionality relied on backend calls, increasing response time and unnecessarily burdening the database.

---

### Optimized Approach & Improvements

A comprehensive optimization strategy was implemented across both frontend and backend layers to improve performance, scalability, and responsiveness:

#### Backend Optimizations

- **Reduced Redundant Queries & Data Filtering**
  - Data is fetched once and reused efficiently.
  - Only required fields are processed and returned to the frontend.
  - **Result:**  
    `getAllJobs` response time reduced from **~13s → ~0.43s**

- **Lazy Data Fetching (Selective Retrieval)**   
  - Eliminated full client data fetch for each record in loop when only client name was needed 
  - **Result:**  
  - Optimized client data fetching in loop  
    `getchatlist` improved from **~9.56s → ~1.9s**

- **Asynchronous Data Fetching**
  - Parallelized fetching of job details and client profiles.
  - **Result:**  
    Average response time reduced from **~6.24s → ~1.15s**

- **Concurrent Worker Handling with Gevent**
  - Enabled non-blocking I/O using `gevent` and `monkey.patch()`.
  - Resolved worker blocking issues and improved concurrency.
  - **Result:**  
    Stable handling of **~1000 concurrent connections** without worker restarts.

---

####  Frontend Optimizations

- **Controlled Data Fetching**
  - Prevented duplicate API calls using `useRef` (`hasFetchedJobsRef`, `lastJobsLangRef`).
  - Improved initial rendering efficiency.

- **Application-Level Caching**
  - Cached job data in global context.
  - Subsequent accesses avoid redundant API calls, reducing latency.

- **Optimized Navigation Handling**
  - Prevented redundant navigation stack entries by checking current route before navigation.
  - Improved memory usage and navigation performance.

- **Client-Side Search Optimization**
  - Implemented real-time search using `.filter()` on cached data.
  - Eliminated per-keystroke backend calls.
  - Reduced server load and improved responsiveness.

---

### Performance Gains Summary

| Feature / API        | Before        | After         |
|---------------------|--------------|--------------|
| getAllJobs          | ~12.97 sec    | ~0.43 sec     |
| get-chatlist        | ~9.56 sec     | ~1.9 sec      |
| Job + Client Fetch  | ~6.24 sec     | ~1.15 sec     |
| Worker Stability    | Frequent shutdown & restarts | Stable (1000+ connections) |

---

### Additional Enhancements

- Implemented **search functionality** across:
  - Jobs (title, location, description)
  - Requests (title, location, client name, status)
  - Chat list (client name)

- Added **Help & Support Modal** with direct email integration.

- Integrated **About Us linking** to project repository.

---



### Work in progress
For clarity, the below features are not functional and currently working on it.
1. Notifications
2. Your Ratings in Profile
3. Saved Address in Profile
4. Settings in Profile
5. Refer and Earn in Profile
6. Top setting's icon in Profile

## Feedback

If you have any feedback, please reach out to me at darshanchoudhary2007@gmail.com

