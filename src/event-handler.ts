import { ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent, TextMessage, MessageAPIResponseBase } from '@line/bot-sdk';
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
}


