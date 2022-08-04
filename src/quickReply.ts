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
                "imageUrl": "https://img.icons8.com/dusk/344/circled-dot.png",
                "action": {
                    "type": "message",
                    "label": "TOEFL",
                    "text": "TOEFL"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/dusk/344/circled-dot.png",
                "action": {
                    "type": "message",
                    "label": "GRE",
                    "text": "GRE"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/dusk/344/circled-dot.png",
                "action": {
                    "type": "message",
                    "label": "TOEIC",
                    "text": "TOEIC"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/dusk/344/circled-dot.png",
                "action": {
                    "type": "message",
                    "label": "IELTS",
                    "text": "IELTS"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/dusk/344/circled-dot.png",
                "action": {
                    "type": "message",
                    "label": "vocab 2000",
                    "text": "vocab 2000"
                }
            },
            {
                "type": "action",
                "imageUrl": "https://img.icons8.com/dusk/344/circled-dot.png",
                "action": {
                    "type": "message",
                    "label": "vocab 7000",
                    "text": "vocab 7000"
                }
            }
        ]
    }
}