import { Client, WebhookEvent} from '@line/bot-sdk';
import { Dialogue } from "./dialogue";
import { controlPanel } from "..";
const emojiRegex = require('emoji-regex');

/** 
 * Takes a string and return empty string or the modified string
 * @param text 
 * @returns the last emoji in the text, or empty string if no emoji
 */
export function emojiCheck(event: WebhookEvent, client: Client, text:string): string{
    let result = '';
    const regex = emojiRegex();
    for (const match of text.matchAll(regex)) {
        const emoji = match[0];
        
        result =  Dialogue.emojiCheck_front[controlPanel.lang] + ` ${ emoji } ${ emoji } ${ emoji } \n` + Dialogue.emojiCheck_back[controlPanel.lang];
    }
    return result;
}

/**
 * Takes a string and check whether this string contains non-english character
 * @param text 
 * @returns the default reply if contains non-english characters, or empty string if no non-english characters
 */
export function englishCheck(event: WebhookEvent, client: Client, text: string): string{
    let pattern : RegExp = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
    let match : boolean = pattern.test(text);
    
    let result = (match === false)? Dialogue.englishCheck[controlPanel.lang]: '';
    return result;  
}
