/**
 * scrapWebsite()
 * askQuestion()
 */

import { processWebsite, askWebsite } from "../services/rag.service.js";

export const scrapWebsite = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    console.log("Controller: Starting to scrap website:", url);
    const result = await processWebsite(url);

    res.status(200).json({
      success: true,
      message: "Website scrapped and processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in scrapWebsite controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to scrap website",
      error: error.message,
    });
  }
};

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const answer = await askWebsite(question);

    return res.status(200).json({
      success: true,
      message: "Answer generated successfully",
      data: answer,
    });
  } catch (error) {
    console.error("Error in askQuestion controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get answer",
      error: error.message,
    });
  }
};
