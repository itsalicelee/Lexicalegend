import axios from 'axios';
import Cheerio from 'cheerio';

const AxiosInstance = axios.create();  // Create a new Axios Instance

// Send an async HTTP Get request to the url
export async function fetchCambridge(text: string): Promise<string>{
    const url = `https://dictionary.cambridge.org/us/dictionary/english-chinese-traditional/${text}`; 
    try{
        const response = await AxiosInstance.get(url);
        const html = response.data;
        const $ = Cheerio.load(html); // Load the HTML string into cheerio
        const def = $('.def-body').text(); // Parse the HTML and extract text
        var result = (def === '') ?  ("Are you looking for: \n " + await spellCheck(text)) : def;
        return result;
    }
    catch(e){
        throw Error("Failed fetching word def QQ");
    };
}


async function spellCheck(text:string): Promise<string>{
    try{
        const url_spellcheck = `https://dictionary.cambridge.org/us/spellcheck/english-chinese-traditional/?q=${text}`;
        const response = await AxiosInstance.get(url_spellcheck);
        const html = response.data;
        const $ = Cheerio.load(html);
        const suggestionLst = $('.lbt.lp-5.lpl-20').text();
        // console.log(suggestionLst);
        return suggestionLst;
    }
    catch(e){
        throw Error("Failed fetching word suggesting QQ");
    }
}