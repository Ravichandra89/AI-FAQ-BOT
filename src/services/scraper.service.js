import axios from "axios";
import cheerio from "cheerio";
import pretty from "pretty";
import fs from "fs";

// Function to scrap data from a given URL
export const scrapData = async (url) => {
    try {
        const response = await axios.get(url);
        
        // loading the html using cheerio
        const $ = cheerio.load(response.data)
;    } catch (error) {
        console.error("Error while scraping data:", error);
        throw error;
    }
}