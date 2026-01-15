import { Client, Account } from "appwrite";
import { EXPO_PUBLIC_APPWRITE_ENDPOINT, EXPO_PUBLIC_APPWRITE_PROJECT_ID } from "../appwrite";
const client = new Client()
client.setEndpoint(EXPO_PUBLIC_APPWRITE_ENDPOINT)
client.setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID)
const account = new Account(client)

export { account }