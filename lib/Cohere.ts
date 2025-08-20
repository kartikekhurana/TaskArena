import { CohereClient } from "cohere-ai";

if (!process.env.COHERE_API_KEY) {
  throw new Error("please define cohere api in env file");
}

export const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

