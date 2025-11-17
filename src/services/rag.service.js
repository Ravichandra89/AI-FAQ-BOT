/**
 * RAG service module will do:
 *   - Scrap Website content
 *   - Chunking the content
 *   - Embedding + vector store
 *   - Reteriving chunks
 *   - Generate RAG response
 */

import { scrapData } from "./scraper.service";
import { chunkText } from "./chunking.service";
import { embedAndStoreChunks } from "./embeddings.service";
import { searchVectorStore } from "./vectorstore.service";
import { ChatOpenAI } from "@langchain/openai";

// Langchain chat model
const llm = new ChatOpenAI({
  apikey: process.env.OPENAI_API_KEY,
  model: "gpt-4o-mini",
  temperature: 0,
});

//  STEP 1: Scrape → Chunk → Embed → Store
export const processWebsite = async (url) => {
  try {
    console.log("🚀 Starting website processing...");
    const scrapped = await scrapData(url);

    console.log("📄 Chunking Scrapped Data...");
    const chunks = await chunkText(scrapped.content);

    console.log("🧠 Embedding and Storing Chunks...");
    await embedAndStoreChunks(chunks, url);

    console.log("✅ Website processing completed.");
    return {
      success: true,
      message: "Website processed successfully",
      url,
      chunkStored: chunks.length,
    };
  } catch (error) {
    console.error("Error processing website:", erorr);
    throw new Error("Failed to process website");
  }
};

/**
 * Step 2 : Retrieve the relevant chunks and generate RAG response
 */
export const reteriveRelevantContext = async (query) => {
  try {
    const result = await searchVectorStore(query, 5);

    if (!result || result.length === 0) {
      return "No relevant information found in the knowledge base.";
    }

    const merged = result.map((r) => r.chunk).join("\n\n");

    return merged;
  } catch (error) {
    console.error("Error generating RAG response:", error);
    throw new Error("Failed to generate RAG response");
  }
};

/**
 * Step 3: Generate RAG Answer Using LangChain ChatOpenAI
 */
export const generateRAGAnswer = async (query) => {
  try {
    console.log("🔍 Retrieving relevant context for the query...");
    const context = await reteriveRelevantContext(query);

    // Validate the context
    if (
      !context ||
      context === "No relevant information found in the knowledge base."
    ) {
      return "I'm sorry, but I couldn't find any relevant information to answer your question.";
    }

    console.log("📝 Generating answer using LLM...");

    const prompt = `You are a RAG-based website FAQ assistant.
Answer ONLY using the context provided. 
If the information is not present, reply:
"Information not available in the scraped website data."

---------------
Context: ${context}
---------------

USER QUESTION: ${query}
Provide the final answer:
`;

    const response = await llm.invoke([
      {
        role: "user",
        content: promps,
      },
    ]);

    return response.content;
  } catch (error) {
    console.error("Error generating RAG answer:", error);
    throw new Error("Failed to generate RAG answer");
  }
};

/**
 * Step 4:  Ask API → Full RAG Query
 */
export const askWebsite = async (query) => {
  try {
    const answer = await generateRAGAnswer(query);

    return {
      query,
      answer,
    };
  } catch (error) {
    console.error("Error in askWebsite:", error);
    throw new Error("Failed to process askWebsite");
  }
};
