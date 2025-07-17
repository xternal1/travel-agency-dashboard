import { Account, Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    tripCollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
};
  
console.log("🔍 Debug Appwrite Env:");
console.log("Endpoint:", import.meta.env.VITE_APPWRITE_API_ENDPOINT);
console.log("Project ID:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
console.log("API Key:", import.meta.env.VITE_APPWRITE_API_KEY);
console.log("Database ID:", import.meta.env.VITE_APPWRITE_DATABASE_ID);
console.log("Users Collection ID:", import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID);
console.log("Trips Collection ID:", import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID);


const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);
        console.log("✅ Client Project Set To:", appwriteConfig.projectId);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };

