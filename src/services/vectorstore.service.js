import { chromaClient, embedQuery } from "./embeddings.service";
import { getCollection } from "./embeddings.service";

export const searchVectorStore = async (query, topk = 5) => {
  try {
    const collection = await getCollection();

    const queryEmbedding = await embedQuery(query);

    // perform chroma similarity search
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topk,
    });

    if (!results || results.length === 0) {
      return [];
    }

    // extract document, metadata, and scores
    const documents = results[0].documents;
    const metadatas = results[0].metadatas;
    const distances = results[0].distances;

    const formattedResponse = documents.map((doc, index) => ({
      chunk: doc,
      metadata: metadatas[index],
      score: distances[index],
    }));

    return formattedResponse;
  } catch (error) {
    console.error("Error searching vector store:", error);
    throw error("Failed to search vector store");
  }
};

/**
 * Optional: Delete all stored embeddings (Useful for dev/reset)
 */
export const clearVectorStore = async () => {
  try {
    await chromaClient.deleteCollection({
      name: "website_embeddings",
    });
    console.log("🧹 Vector store cleared successfully.");
  } catch (error) {
    console.error("❌ Error clearing vector store:", error);
    throw new Error("Failed to clear vector store");
  }
};
