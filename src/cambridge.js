const cheerio = require('cheerio')
const axios = require("axios");


const AxiosInstance = axios.create();  // Create a new Axios Instance

// Send an async HTTP Get request to the url
async function fetchCambridge(text){
    const url = `https://dictionary.cambridge.org/us/dictionary/english-chinese-traditional/${text}`; 
    try{
        const response = await AxiosInstance.get(url);
        const html = response.data;
        const $ = cheerio.load(html); // Load the HTML string into cheerio
        const statsTable = $('.def-body').text(); // Parse the HTML and extract text
        console.log(statsTable); // Log the number of captured elements
        return statsTable;
    }
    catch(e){
        throw new Error('Failed fetching QQ');
    };
}
