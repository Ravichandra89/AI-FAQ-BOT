import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

// chromaClient Instance
const chromaClient = new ChromaClient({
  path: "./data/vector-store",
});

// openAI Embeddings Instance
const openAIEmbeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
});

// chroma collection
const getCollection = async () => {
  const name = "website-embeddings";

  try {
    return await chromaClient.getCollection({
      name,
    });
  } catch (error) {
    console.error("Error getting collection:", error);
    return await chromaClient.createCollection({
      name,
    });
  }
};

// embed the chunks and store in chromaDB
export const embedAndStoreChunks = async (chunks, url) => {
  try {
    // get collection
    const collection = await getCollection();

    // generate embeddings for chunks
    const embeddings = await openAIEmbeddings.embedDocuments(chunks);

    const ids = chunks.map((_, index) => `${url}-${index}`);

    // store embeddings in chromaDB Collection
    await collection.add({
      ids,
      embeddings: embeddingsArray,
      doument: chunks,
      metadatas: chunks.map(() => ({ source: url })),
    });

    console.log("✅ Embeddings stored successfully in ChromaDB");
  } catch (error) {
    console.error("✅ Embeddings stored successfully in ChromaDB");
    throw new Error("Embedding failed");
  }
};
