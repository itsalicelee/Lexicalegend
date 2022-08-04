import { Client, WebhookEvent, MessageAPIResponseBase} from '@line/bot-sdk';
import { suggestEventHandler, studyTypeEventHandler, anotherWordEventHandler, reportEventHandler, textEventHandler } from './event-handler';
import { User } from '..';

export const textRouter = async (event: WebhookEvent, client: Client, user: User): Promise<MessageAPIResponseBase | undefined> => {
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
        user.mode = 'studyType';
        studyTypeEventHandler(event, client, replyToken, user);
        return;
    }
    if(user.mode === 'suggest'){
        //TODO: support new exam here
        if(text.toUpperCase() === 'TOEFL'){user.studyType = 'TOEFL';}
        else if(text.toUpperCase() === 'GRE'){user.studyType = 'GRE';}
        else if(text.toUpperCase() === 'TOEIC'){user.studyType = 'TOEIC';}
        else if(text.toUpperCase() === 'IELTS'){user.studyType = 'IELTS';}
        else if(text.toUpperCase() === 'VOCAB 2000'){user.studyType = 'JUNIOR';}
        else if(text.toUpperCase() === 'VOCAB 7000'){user.studyType = 'SENIOR';}
        else{  // user type something other than studyType
            user.mode = 'studyType';
            studyTypeEventHandler(event, client, replyToken, user);
            return;
        }
        suggestEventHandler(event, client, replyToken, user);
        return;
    }
    if(user.mode === 'anotherWord'){
        anotherWordEventHandler(event, client, text, replyToken, user);
        return;
    }


    if(report){
        reportEventHandler(event, client, replyToken, user);
    }
    else{
        textEventHandler(event, client, text, replyToken, user);
    }
}
