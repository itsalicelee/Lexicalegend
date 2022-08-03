import { QuickReply } from '@line/bot-sdk';
interface IQuickReply{
    yes_no: QuickReply,
    exams: QuickReply,  // TODO: support new exams here
}

export const MyQuickReply: IQuickReply = {
    yes_no: {
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
    },
    exams: {
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
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/color/344/4-c.png",
                "action": {
                    "type": "message",
                    "label": "IELTS",
                    "text": "IELTS"
                }
            }
        ]
    }
}