/**
 * Chunking + Cleaning Service Module
 * This module provides functionalities to split large text into smaller chunks
 * and clean the text by removing unwanted characters and formatting.
 */

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter/RecursiveCharacterTextSplitter";

// method to chunk text
export const chunkText = async (text) => {
  try {
    // validate the input text
    if (!text || typeof text !== "string") {
      throw new Error("Invalid text input");
    }

    // text splitter instance
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 800,
      chunkOverlap: 150,
      seperators: ["\n\n", "\n", " ", ""],
    });

    // split the text into chunks
    const chunks = await textSplitter.splitText(text);

    return chunks;
  } catch (error) {
    console.error("Error chunking text:", error);
    throw error("Failed to chunk text");
  }
};
