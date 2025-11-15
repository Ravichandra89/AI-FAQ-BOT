import axios from "axios";
import cheerio from "cheerio";
import pretty from "pretty";
import fs from "fs";

// remove noisy things from html
const REMOVE_SELECTORS = [
  "script",
  "style",
  "noscript",
  "iframe",
  "footer",
  "nav",
  "header",
  "canvas",
  "svg",
  "img",
  "video",
  "picture",
  "source",
  ".navbar",
  ".nav",
  ".menu",
  ".footer",
];

// Function to scrap data from a given URL
export const scrapData = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 15000, // 15 seconds
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Removing noisy elements
    REMOVE_SELECTORS.forEach((selector) => {
      $(selector).remove();
    });

    // extracting redable text
    const textContent = $("body")
      .text()
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    // Optional
    const title = $("title").text() || null;

    const description = $('meta[name="description"]').attr("content") || null;

    return {
      url,
      title,
      description,
      content: textContent,
    };
  } catch (error) {
    console.error("Error while scraping data:", error);
    throw new Error("Failed to scrape URL");
  }
};
