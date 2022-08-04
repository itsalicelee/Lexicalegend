import { Client, WebhookEvent, TextMessage, MessageAPIResponseBase, StickerMessage, QuickReply} from '@line/bot-sdk';
import { controlPanel } from '..';
import { suggestEventHandler, studyTypeEventHandler, anotherWordEventHandler, reportEventHandler, textEventHandler } from './event-handler';

export const textRouter = async (event: WebhookEvent, client: Client): Promise<MessageAPIResponseBase | undefined> => {
    // Process all variables here.
    if (event.type !== 'message' || event.message.type !== 'text') {
        return;
    }

    // Process all message related variables here.
    const { replyToken } = event;
    const { text } = event.message;


    // Bug report 
    const reportArr: string[] = ['REPORT', 'ISSUE', 'BUG', 'FEEDBACK', '問題', '建議', '回報', '回饋', '🐛', '🐜', '🐞'];
    const suggestArr: string[] = ['STUDY', '學習'];
    let report: boolean = reportArr.some(key => text.includes(key));
    
    // Router 
    if(suggestArr.some(key => text.includes(key))){
        controlPanel.mode = 'studyType';
        studyTypeEventHandler(event, client, replyToken);
        return;
    }
    if(controlPanel.mode === 'suggest'){
        //TODO: support new exam here
        if(text.toUpperCase() === 'TOEFL'){controlPanel.studyType = 'TOEFL';}
        else if(text.toUpperCase() === 'GRE'){controlPanel.studyType = 'GRE';}
        else if(text.toUpperCase() === 'TOEIC'){controlPanel.studyType = 'TOEIC';}
        else if(text.toUpperCase() === 'IELTS'){controlPanel.studyType = 'IELTS';}
        else if(text.toUpperCase() === 'VOCAB 2000'){controlPanel.studyType = 'JUNIOR';}
        else if(text.toUpperCase() === 'VOCAB 7000'){controlPanel.studyType = 'SENIOR';}
        else{  // user type something other than studyType
            controlPanel.mode = 'studyType';
            studyTypeEventHandler(event, client, replyToken);
            return;
        }
        suggestEventHandler(event, client, replyToken);
        return;
    }
    if(controlPanel.mode === 'anotherWord'){
        anotherWordEventHandler(event, client, text, replyToken);
        return;
    }


    if(report){
        reportEventHandler(event, client, replyToken);
    }
    else{
        textEventHandler(event, client, text, replyToken);
    }
}