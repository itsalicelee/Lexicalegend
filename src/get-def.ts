import axios from 'axios';
import Cheerio from 'cheerio';
import { Dialogue } from './dialogue';
import { Lang } from '..';

const AxiosInstance = axios.create();  // Create a new Axios Instance

export async function getDef(text: string, lang: Lang): Promise<string>{
    try{
        // default fetch from cambridge
        let def: string = await fetchCambridge(text,lang);
        // if can't found in cambridge fetch from dr.eye
        if(def.length === 0){
            def = await fetchDreye(text, lang);
        }
        console.log(def);
        return def;
    }
    catch(e){
        console.log(e);
        return Dialogue.failedGetDef[lang];
    }

}


// Send an async HTTP Get request to the url
export async function fetchCambridge(text: string, lang: Lang): Promise<string>{
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
            def += `\n\n✍️  ${example_eng}${example_zht}`
        }
        return def;
    }
    catch(e){
        console.log(e);
        return Dialogue.failedGetDef[lang];
    };
}

// Send an async HTTP Get request to the url
export async function fetchDreye(text: string, lang: Lang): Promise<string>{
    const url = `https://yun.dreye.com/dict_new/dict.php?w=${text}`; 
    try{
        const response = await AxiosInstance.get(url);
        const html = response.data;
        const $ = Cheerio.load(html); // Load the HTML string into cheerio
        
        // get a list of definitioins
        let defLst: string[] = [];
        let defBody = $(`.sg.block`).first().find(`ol > li`).each((i: number, word:any) =>{
            defLst.push("➡️" + $(word).contents().get(0).nodeValue);
        });
        if(defLst.length === 0){
            let defBody = $('#digest').find('ul').each((i: number, el: any) => {
                defLst.push("➡️" + $(el).find(`li`).find(`span`).not(`.label`).text());
            });
        }

        // join the definitions into a string
        let def = defLst.join("\n");
        if(def.length > 3000){
            def = def.substring(0,2000);
        }
        // add examples from dictionary
        let example = $(`.sg.block`).find(`ol > li > div`).first().text();

        if(example.length !== 0){
            def += `\n\n✍️  ${example}`
        }
        return def;
    }
    catch(e){
        console.log(e);
        return Dialogue.failedGetDef[lang];
    };
}


export async function getSpellCheckLst(text:string, lang: Lang): Promise<string>{
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
        console.log(e);
        return Dialogue.failedGetDef[lang];
    }
}
