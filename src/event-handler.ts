import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase, StickerMessage, QuickReply} from '@line/bot-sdk';
import { emojiCheck, englishCheck} from './text-process';
import {fetchCambridge} from './cambridge';
import { controlPanel } from '..';
import * as utils from './utils';

export const followEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'follow') {
        return;
    }

    const { replyToken } = event;
    // userID is not null
    const userID: string = event.source.userId!;
    const displayName = (await client.getProfile(userID)).displayName;

    
    let reply = `Hi ${displayName}! Let's learn vocabulary! 👩‍🏫\nYou can type any word to look up its translation.`;
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

// Function handler to receive the text.
export const textEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    // Process all variables here.
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    // Process all message related variables here.
    const { replyToken } = event;
    const { text } = event.message;

    let reply = '';

    // Bug report 
    const reportArr: string[] = ['REPORT', 'ISSUE', 'BUG', 'FEEDBACK', '問題', '建議', '回報', '回饋', '🐛', '🐜', '🐞'];
    const suggestArr: string[] = ['STUDY', '學習'];
    let report: boolean = reportArr.some(key => text.includes(key));
    if(suggestArr.some(key => text.includes(key))){
        controlPanel.mode = 'studyType';
        studyTypeEventHandler(client, replyToken);
        return;
    }
    if(controlPanel.mode === 'suggest'){
        if(text.toUpperCase() === 'TOEFL'){controlPanel.studyType = 'TOEFL';}
        else if(text.toUpperCase() === 'GRE'){controlPanel.studyType = 'GRE';}
        else if(text.toUpperCase() === 'TOEIC'){controlPanel.studyType = 'TOEIC';}
        suggestEventHandler(client, replyToken);
        return;
    }
    if(controlPanel.mode === 'anotherWord'){
        anotherWordEventHandler(client, text, replyToken);
        return;
    }

    if(report){
        reply = `Please report the issue in the form! 🙇‍♀️ https://forms.gle/aawPQNEYfEgwyvCi8 `
    }
    // Check if contains emoji
    else if(emojiCheck(text) != ''){  
        reply = emojiCheck(text);
    }        
    // Check if contains non-enlish character
    else if(englishCheck(text) != ''){
        reply = englishCheck(text);
    }
    // Look up translation
    else{
        reply = await fetchCambridge(text);
    }

    // Create a new message.
    var response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
};

export const imageEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'image') {
        return;
    }
    
    const { replyToken } = event;
    let reply = "I love this image! ❤️";
    // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
    return;
}

export const audioEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'audio') {
        return;
    }

    const { replyToken } = event;
    let reply = "Ooops...I'm better at recognizing words... 👀";
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const videoEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'video') {
        return;
    }

    const { replyToken } = event;
    let reply = "Thanks for sharing! 😎";
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const locationEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'location') {
        return;
    }

    const { replyToken } = event;
    let reply = "It is good people who make good places. ✨";
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const stickerEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'sticker') {
        return;
    }
    
    //  generate a sticker id from the corresponding packageID
    var randomStick: number = utils.randomInteger(51626494, 51626532);
    const { replyToken } = event;
    
     // Create a new message.
    const response: StickerMessage = {
        type: "sticker",
        packageId: "11538",
        stickerId: randomStick.toString(),
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const fileEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'file') {
        return;
    }

    const { replyToken } = event;
    let reply = "Stop telling people more than they need to know! 👻";
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

/** 
 * Given a text, randomly selects a word from the corresponding wordlist and return its def
 * @param client
 * @param text: TOEFL | GRE | TOEIC from quick reply 
 * @param replyToken
 * @returns quick reply of studyType(TOEFL, GRE, TOEIC)
 */
export const suggestEventHandler = async (client: Client, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    if(controlPanel.mode != 'suggest'){ return; }
    console.log("Suggest Event Handler!");

    var suggestedWord: string = '';

    if(controlPanel.studyType === 'TOEFL'){
        suggestedWord = utils.suggestWord('toefl');
    }
    else if(controlPanel.studyType === 'GRE'){
        suggestedWord = utils.suggestWord('gre');
    }
    else if(controlPanel.studyType === 'TOEIC'){
        suggestedWord = utils.suggestWord('toeic');
    }
    if(controlPanel.studyType === 'none'){ // user type something else instead of using quick reply 
        controlPanel.mode = 'studyType';
        studyTypeEventHandler(client, replyToken);
        return;
    }

    //TODO:  suggested word not found
    let reply: string = '';
    reply = await fetchCambridge(suggestedWord);
    reply = `✅ ${suggestedWord} \n\n` + reply;
    var response1: TextMessage = {
        type: 'text',
        text: reply,
    }
    
    //TODO: default return back to dictionary mode, add router quick reply
    let anotherReply = 'Would you like to learn another word? 🦄';
    var response2: TextMessage = {
        type: 'text',
        text: anotherReply,
    }
    response2.quickReply = {
        "items": [
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/emoji/344/check-mark-button-emoji.png",
                "action": {
                    "type": "message",
                    "label": "YES",
                    "text": "YES"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/emoji/344/cross-mark-button-emoji.png",
                "action": {
                    "type": "message",
                    "label": "NO",
                    "text": "NO"
                }
            },
        ]
    }

    controlPanel.mode = 'anotherWord';
    await client.replyMessage(replyToken, [response1, response2]);
    return;
}

/** 
 * Ask user studyType by quick reply and change mode to suggest
 * @param client
 * @param replyToken
 * @returns quick reply of studyType(TOEFL, GRE, TOEIC)
 */
export const studyTypeEventHandler = async (client: Client, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    if(controlPanel.mode != 'studyType'){ return; }
    console.log("Study Type Event Handler!");
    let reply = 'What kind of exam would you like to study?';
    var response: TextMessage = {
        type: 'text',
        text: reply,
    }
    response.quickReply = {
        "items": [
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/color/344/1-c.png",
                "action": {
                    "type": "message",
                    "label": "TOEFL",
                    "text": "TOEFL"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/color/344/2-c.png",
                "action": {
                    "type": "message",
                    "label": "GRE",
                    "text": "GRE"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/color/344/3-c.png",
                "action": {
                    "type": "message",
                    "label": "TOEIC",
                    "text": "TOEIC"
                }
            }
        ]
    }
    // change mode to suggest after suggesting studyType
    controlPanel.mode = 'suggest';
    await client.replyMessage(replyToken, response);
    return;
}


/** 
 * Ask user recommend another word, if so, go back to suggest event handler; else return back to dict mode
 * @param client
 * @param replyToken
 * @returns go back to suggest event handler; or return back to dict mode
 */
export const anotherWordEventHandler = async (client: Client, text: string, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    if(controlPanel.mode != 'anotherWord'){ return; }
    console.log("Another Word Event Handler!");
    if(text.toUpperCase() === 'YES'){
        controlPanel.mode = 'suggest';
        suggestEventHandler(client, replyToken);
        return;
    }
    else if(text.toUpperCase() === 'NO'){
        controlPanel.mode = 'dict';
        let reply = "Back to dictionary mode 📖";
        // Create a new message.
        const response: TextMessage = {
            type: 'text',
            text: reply,
        };
        await client.replyMessage(replyToken, response);
        return;
    }
    else{  // user replys neither YES nor NO
        let anotherReply = 'Would you like to learn another word? 🦄';
        var response2: TextMessage = {
            type: 'text',
            text: anotherReply,
        }
        response2.quickReply = {
            "items": [
                {
                    "type": "action",
                    "imageUrl": "https://img.icons8.com/emoji/344/check-mark-button-emoji.png",
                    "action": {
                        "type": "message",
                        "label": "YES",
                        "text": "YES"
                    }
                },
                {
                    "type": "action",
                    "imageUrl": "https://img.icons8.com/emoji/344/cross-mark-button-emoji.png",
                    "action": {
                        "type": "message",
                        "label": "NO",
                        "text": "NO"
                    }
                },
            ]
        }
        await client.replyMessage(replyToken, response2);
        return;
    }
}
