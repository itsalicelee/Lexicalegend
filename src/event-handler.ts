import { Dialogue } from './dialogue';
import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase, StickerMessage, QuickReply} from '@line/bot-sdk';
import { emojiCheck, englishCheck} from './text-check';
import {fetchCambridge, getSpellCheckLst} from './cambridge';
import { controlPanel } from '..';
import * as utils from './utils';
import { MyQuickReply } from './quickReply';

export const getUserProfile = async (event: WebhookEvent, client: Client) => {
    const userID: string = event.source.userId!;
    const displayName = (await client.getProfile(userID)).displayName;
    const lang = (await client.getProfile(userID)).language;  //TODO: get profile and save to controlPanel
    console.log(lang);
    controlPanel.displayName = displayName;
    controlPanel.lang = (lang?.includes('zh')) ? 'zh' : 'en';
}


export const followEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'follow') {
        return;
    }

    const { replyToken } = event;
    // userID is not null
    const userID: string = event.source.userId!;
    const displayName = (await client.getProfile(userID)).displayName;
    getUserProfile(event, client);
    let reply = `Hi ${displayName}! ` + Dialogue.follow[controlPanel.lang];
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

// Function handler to receive the text.
export const textEventHandler = async (client: Client, text: string, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {

    let reply = '';

    if(emojiCheck(text) != ''){  
        reply = emojiCheck(text);
    }        
    // Check if contains non-enlish character
    else if(englishCheck(text) != ''){
        reply = englishCheck(text);
    }
    // Look up translation
    else{
        var def = await fetchCambridge(text);
        if(def === ''){  // no this word, give spell check list
            reply = Dialogue.spellCheck + await getSpellCheckLst(text);
        }
        else{
            reply = def;
        }
    }

    // Create a new message.
    var response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
    return;
}

export const imageEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'image') {
        return;
    }
    
    const { replyToken } = event;
    getUserProfile(event, client);
    let reply = Dialogue.image[controlPanel.lang];
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
    getUserProfile(event, client);
    let reply = Dialogue.audio[controlPanel.lang];
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
    getUserProfile(event, client);
    let reply = Dialogue.video[controlPanel.lang];
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
    getUserProfile(event, client);
    let reply = Dialogue.location[controlPanel.lang];
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
    getUserProfile(event, client);
    let reply = Dialogue.file[controlPanel.lang];
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
 * @param replyToken
 * @returns quick reply of studyType(TOEFL, GRE, TOEIC, IELTS)
 */
export const suggestEventHandler = async (event: WebhookEvent, client: Client, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    if(controlPanel.mode != 'suggest'){ return; }
    console.log("Suggest Event Handler!");

    var suggestedWord: string = '';

    let reply: string = '';
    var def = '';
    while(def === ''){  // no this word, suggest new word again
        suggestedWord = utils.suggestWord(controlPanel.studyType.toUpperCase());
        def = await fetchCambridge(suggestedWord);
    }
    
    
    reply = `✅ ${suggestedWord} \n\n` + def;
    var response1: TextMessage = {
        type: 'text',
        text: reply,
    }
    
    getUserProfile(event, client);
    let anotherReply = Dialogue.anotherWord[controlPanel.lang];
    var response2: TextMessage = {
        type: 'text',
        text: anotherReply,
    }
    response2.quickReply = MyQuickReply.yes_no;

    controlPanel.mode = 'anotherWord';
    await client.replyMessage(replyToken, [response1, response2]);
    return;
}

/** 
 * Ask user studyType by quick reply and change mode to suggest
 * @param client
 * @param replyToken
 * @returns quick reply of studyType(TOEFL, GRE, TOEIC, IELTS)
 */
export const studyTypeEventHandler = async (event: WebhookEvent, client: Client, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    if(controlPanel.mode != 'studyType'){ return; }
    console.log("Study Type Event Handler!");
    getUserProfile(event, client);
    let reply = Dialogue.studyType[controlPanel.lang];
    var response: TextMessage = {
        type: 'text',
        text: reply,
    }
    
    response.quickReply = MyQuickReply.exams;
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
export const anotherWordEventHandler = async (event: WebhookEvent, client: Client, text: string, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    if(controlPanel.mode != 'anotherWord'){ return; }
    console.log("Another Word Event Handler!");
    if(text.toUpperCase() === 'YES'){
        controlPanel.mode = 'suggest';
        getUserProfile(event, client);
        suggestEventHandler(event, client, replyToken);
        return;
    }
    else if(text.toUpperCase() === 'NO'){
        controlPanel.mode = 'dict';
        let reply = Dialogue.dictMode[controlPanel.lang];
        // Create a new message.
        const response: TextMessage = {
            type: 'text',
            text: reply,
        };
        await client.replyMessage(replyToken, response);
        return;
    }
    else{  // user replys neither YES nor NO
        let anotherReply = Dialogue.anotherWord[controlPanel.lang];
        var response2: TextMessage = {
            type: 'text',
            text: anotherReply,
        }
        response2.quickReply = MyQuickReply.yes_no;
        await client.replyMessage(replyToken, response2);
        return;
    }
}


export const reportEventHandler = async (event: WebhookEvent, client: Client, replyToken: string): Promise<MessageAPIResponseBase | undefined> => {
    getUserProfile(event, client);
    let reply = Dialogue.report[controlPanel.lang];
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
    return;
}