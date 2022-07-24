const emojiRegex = require('emoji-regex');

/** 
 * Takes a string and return empty string or the modified string
 * @param text 
 * @returns the last emoji in the text, or empty string if no emoji
 */
export function emojiCheck(text:string): string{
    let result = '';
    const regex = emojiRegex();
    for (const match of text.matchAll(regex)) {
        const emoji = match[0];
        result =  `I love this emoji! ${ emoji } ${ emoji } ${ emoji } \nIf you want to look up a word, ask me without emojis!`;
    }
    return result;
}

/**
 * Takes a string and check whether this string contains non-english character
 * @param text 
 * @returns the default reply if contains non-english characters, or empty string if no non-english characters
 */
export function englishCheck(text: string): string{
    let pattern : RegExp = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
    let match : boolean = pattern.test(text);
    let result = (match === false)? "Well...Ask me again in English 👩‍💻": '';
    return result;  
}
