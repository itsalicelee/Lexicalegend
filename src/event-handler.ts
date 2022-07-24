import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk';
import { emojiCheck } from './text-process';
import {fetchCambridge} from './cambridge';

// Function handler to receive the text.
export const textEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    // Process all variables here.
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    // Process all message related variables here.
    const { replyToken } = event;
    const { text } = event.message;

    // If contains emoji return the default reply 
    // Otherwise fetch the word definition from cambridge dictionary
    let reply = (emojiCheck(text) != '') ? (emojiCheck(text)) : await fetchCambridge(text);
    
    // Create a new message.
    const response: TextMessage = {
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
    let reply = "Ooops...I'm better at recognizing words 👀";
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

export const fileEventHandler = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    if (event.type !== 'message' || event.message.type !== 'file') {
        return;
    }

    const { replyToken } = event;
    let reply = "Stop telling people more than they need to know 👻";
     // Create a new message.
    const response: TextMessage = {
        type: 'text',
        text: reply,
    };

    // Reply to the user.
    await client.replyMessage(replyToken, response);
}

