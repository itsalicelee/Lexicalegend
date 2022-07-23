import axios from 'axios';
import Cheerio from 'cheerio';

const AxiosInstance = axios.create();  // Create a new Axios Instance

// Send an async HTTP Get request to the url
export async function fetchCambridge(text: string): Promise<string>{
    var result = '';
    const url = `https://dictionary.cambridge.org/us/dictionary/english-chinese-traditional/${text}`; 
    try{
        const response = await AxiosInstance.get(url);
        const html = response.data;
        const $ = Cheerio.load(html); // Load the HTML string into cheerio
        
        // get a list of definitioins
        let defLst: string[] = [];
        let defBody = $(`.def-body`).each((i: number, el: any) => {
            defLst.push($(el).find(`span`).first().text());
        });
        // join the definitions into a string
        let def = defLst.join("\n");
        if(def.length > 3000){
            def = def.substring(0,1500);
        }
        // check spelling        
        var result = (def === '') ?  ("Are you looking for: \n " + await spellCheck(text)) : def;
        console.log(result);
        
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
        if(suggestionLst.length > 3000){
            return suggestionLst.substring(0,1500);
        }
        return suggestionLst;
    }
    catch(e){
        throw Error("Failed fetching word suggesting QQ");
    }
}
