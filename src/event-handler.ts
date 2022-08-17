
import { Dialogue } from './dialogue';
import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase, StickerMessage, ImageMessage, Profile} from '@line/bot-sdk';
import { emojiCheck, englishCheck} from './text-check';
import {getDef, getSpellCheckLst} from './get-def';
import { users, User, Mode, StudyType, Lang} from '..';
import { MyQuickReply } from './quickReply';
import * as utils from './utils';

const getUser = (userID: string) => {
    const targeUser = users.find(ele => {
        if (ele.id === userID) {
            return true;
        }
        return false;
    });
    return targeUser;
}

export const getUserProfile = async (event: WebhookEvent, client: Client): Promise<User> => {
    const userID: string = event.source.userId!;
    const profile: Profile = (await client.getProfile(userID));
    const displayName: string = profile.displayName;
    const lang: Lang = (profile.language?.includes('zh')) ? 'zh' : 'en';
    
    // add new user to array 
    if(getUser(userID) === undefined){
        var user_ = new User(userID, displayName, lang, 'dict', undefined);
        users.push(user_);
    }
    return getUser(userID)!;
}


export const followEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'follow') {
        return;
    }
    
    const { replyToken } = event;
    
    let reply = `Hi ${user.displayName}! ` + Dialogue.follow[user.lang];
     // Create a new message of follow message in dialogue
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    const imgResponse: ImageMessage = {
        type: 'image',
        originalContentUrl: 'https://raw.githubusercontent.com/itsalicelee/Lexicalegend/master/img/lexicalegend.jpg',
        previewImageUrl: 'https://raw.githubusercontent.com/itsalicelee/Lexicalegend/master/img/preview_lexicalegend.jpg'
    }


    // Reply to the user.
    await client.replyMessage(replyToken, [response, imgResponse]);
    return;
}


export const textEventHandler = async (event: WebhookEvent, client: Client, text: string, replyToken: string, user: User): Promise<MessageAPIResponseBase | undefined> => {
    let reply = '';

    if(emojiCheck(event, client, text, user) != ''){  
        reply = emojiCheck(event, client, text, user);
    }        
    // Check if contains non-enlish character
    else if(englishCheck(event, client, text, user) != ''){
        reply = englishCheck(event, client, text, user);
    }
    // Look up translation
    else{
        var def = await getDef(text, user.lang);
        // if no this word, give spell check list
        reply = (def === '') ? (Dialogue.spellCheck[user.lang] + await getSpellCheckLst(text, user.lang)) : def;
    }

    // Create a new message of word def or spell check list
    var response: TextMessage = {
        type: 'text',
        text: reply,
    };
    await client.replyMessage(replyToken, response);
    return;
}

/** 
 * Given a text, randomly selects a word from the corresponding wordlist and return its def
 * @param event
 * @param client
 * @param replyToken
 * @returns suggest word with def and quick reply of studyType
 */
export const suggestEventHandler = async (event: WebhookEvent, client: Client, replyToken: string, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if(user.mode != 'suggest'){ 
        return; 
    }
    
    // suggest a word with definition
    var suggestedWord: string = '';
    var def: string = '';
    while(def === ''){  // no this word, suggest new word again
        suggestedWord = utils.suggestWord(user);
        def = await getDef(suggestedWord, user.lang);
    }

    // concat the word with its def
    var reply: string = '';
    reply = def;
    var response1: TextMessage = {
        type: 'text',
        text: reply,
    }
    
    // ask if user wants to learn another word with quick reply
    let anotherReply = Dialogue.anotherWord[user.lang];
    var response2: TextMessage = {
        type: 'text',
        text: anotherReply,
    }
    response2.quickReply = MyQuickReply.yes_no;
    user.mode = 'anotherWord';
    // reply to user with two message: 
    // 1. word with def 
    // 2. ask if user wants to learn another word
    await client.replyMessage(replyToken, [response1, response2]);
    return;
}

/** 
 * Ask user studyType by quick reply and change mode to suggest
 * @param event
 * @param client
 * @param replyToken
 * @returns quick reply of studyType
 */
export const studyTypeEventHandler = async (event: WebhookEvent, client: Client, replyToken: string, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if(user.mode != 'studyType'){ return; }
    
    // let user choose from quick reply exams
    let reply = Dialogue.studyType[user.lang];
    var response: TextMessage = {
        type: 'text',
        text: reply,
    }
    response.quickReply = MyQuickReply.exams;
    // change mode to suggest after suggesting studyType
    user.mode = 'suggest';
    await client.replyMessage(replyToken, response);
    return;
}

/** 
 * Ask user recommend another word, if so, go back to suggest event handler; else return back to dict mode
 * @param client
 * @param replyToken
 * @returns go back to suggest event handler; or return back to dict mode
 */
export const anotherWordEventHandler = async (event: WebhookEvent, client: Client, text: string, replyToken: string, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if(user.mode != 'anotherWord'){ 
        return; 
    }
    // user wants to learn another word, suggest another word
    if(text.trim().toUpperCase() === 'YES'){
        user.mode = 'suggest';
        suggestEventHandler(event, client, replyToken, user);
        return;
    }
    // user does not want to learn another word, go back to dict mode
    else if(text.trim().toUpperCase() === 'NO'){
        user.mode = 'dict';
        let reply = Dialogue.dictMode[user.lang];
        // Create a new message.
        const response: TextMessage = {
            type: 'text',
            text: reply,
        };
        await client.replyMessage(replyToken, response);
        return;
    }
    else{  // user replys neither YES nor NO
        let anotherReply = Dialogue.anotherWord[user.lang];
        var response2: TextMessage = {
            type: 'text',
            text: anotherReply,
        }
        response2.quickReply = MyQuickReply.yes_no;
        await client.replyMessage(replyToken, response2);
        return;
    }
}

export const imageEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'image') {
        return;
    }
    
    const { replyToken } = event;
    
    let reply = Dialogue.image[user.lang];
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };
    // Reply to the user.
    await client.replyMessage(replyToken, response);
    return;
}

export const audioEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'audio') {
        return;
    }

    const { replyToken } = event;
    
    let reply = Dialogue.audio[user.lang];
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };
    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const videoEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'video') {
        return;
    }

    const { replyToken } = event;
    
    let reply = Dialogue.video[user.lang];
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };
    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const locationEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'location') {
        return;
    }

    const { replyToken } = event;
    
    let reply = Dialogue.location[user.lang];
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };
    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const stickerEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'sticker') {
        return;
    }
    
    //  generate a sticker id from the corresponding packageID
    var randomStick: number = utils.randomInteger(51626494, 51626532);
    const { replyToken } = event;
    
    // Create a new sticker message according to packageId and stickerId
    const response: StickerMessage = {
        type: "sticker",
        packageId: "11538",
        stickerId: randomStick.toString(),
    };
    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const fileEventHandler = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'file') {
        return;
    }

    const { replyToken } = event;
    
    let reply = Dialogue.file[user.lang];
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };
    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

export const reportEventHandler = async (event: WebhookEvent, client: Client, replyToken: string, user: User): Promise<MessageAPIResponseBase | undefined> => {
    let reply = Dialogue.report[user.lang];
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };
    await client.replyMessage(replyToken, response);
    return;
}
