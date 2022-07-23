const emojiRegex = require('emoji-regex');

/** 
 * Takes a string and return empty string or the modified string
 * @param text 
 * @returns the last emoji in the text, or empty string if no emoji
 */
export function emojiCheck(text:string):string{
    let result = '';
    const regex = emojiRegex();
    for (const match of text.matchAll(regex)) {
        const emoji = match[0];
        result =  `I love this emoji! ${ emoji } ${ emoji } ${ emoji } \nIf you want to look up a word, ask me without emojis!`;
    }
    return result;
}



