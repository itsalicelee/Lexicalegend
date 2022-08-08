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
            defLst.push("➡️" + $(el).find(`span`).first().text());
        });
        // join the definitions into a string
        let def = defLst.join("\n");
        if(def.length > 3000){
            def = def.substring(0,2000);
        }
        // add examples from dictionary
        let example = $(`.examp.dexamp`).first();
        let example_eng = example.find(`span`).first().text();
        let example_zht = example.find(`span`).last().text();
        if(example.length !== 0){
            def += `\n\n✍️  ${example_eng} \n${example_zht}`
        }
        
        console.log(def);       
        return def;
    }
    catch(e){
        throw Error("Failed fetching word def QQ");
    };
}


export async function getSpellCheckLst(text:string): Promise<string>{
    try{
        const url_spellcheck = `https://dictionary.cambridge.org/us/spellcheck/english-chinese-traditional/?q=${text}`;
        const response = await AxiosInstance.get(url_spellcheck);
        const html = response.data;
        const $ = Cheerio.load(html);
        // format suggeting words
        const spellCheckLst = $('.lbt.lp-5.lpl-20').text().replace(/  +/g, ' ');
        
        if(spellCheckLst.length > 3000){
            return spellCheckLst.substring(0,1500);
        }
        return spellCheckLst;
    }
    catch(e){
        throw Error("Failed fetching word suggesting QQ");
    }
}
