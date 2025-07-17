import { client } from "./app/appwrite/client";

client.call("GET", new URL("/health")).then(
    (response) => {
        console.log("Appwrite API is working:", response);
    },
    (error) => {
        console.error("Appwrite API test error:", error);
    }
);  
