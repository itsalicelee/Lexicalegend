// Import all dependencies, mostly using destructuring for better view.
import { ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent} from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';
import * as EventHandler from './src/event-handler';
import { textRouter } from './src/router';

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

// Create a new LINE SDK client.
const client = new Client(clientConfig);

// Create a new Express application.
const app: Application = express();

 //TODO: support new exam here
interface IControl{
    mode: 'dict' | 'suggest' | 'studyType' | 'anotherWord',
    studyType?: 'GRE' | 'TOEFL' | 'TOEIC' | 'IELTS' | 'JUNIOR' | 'SENIOR', 
    lang: 'en' | 'zh',  //TODO: sett user language here, if zh set zh; else en
    displayName: string,
};


export var controlPanel: IControl = {
    mode: 'dict',
    studyType: undefined,
    lang: 'zh',
    displayName: '',
};

// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.get(
  '/webhook',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'Connected successfully!😼',
    });
  }
);

// This route is used for the Webhook.
app.post(
  '/webhook',
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;
     

    // Process all of the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
            EventHandler.getUserProfile(event, client);
            if(event.type === 'follow'){
                await EventHandler.followEventHandler(event, client);
            }
            else if(event.type === 'message'){
                switch(event.message.type){
                    case 'text':
                        await textRouter(event, client);
                    case 'image': 
                        await EventHandler.imageEventHandler(event, client);
                    case 'audio':
                        await EventHandler.audioEventHandler(event, client);
                    case 'video':
                        await EventHandler.videoEventHandler(event, client);
                    case 'location':
                        await EventHandler.locationEventHandler(event, client);
                    case 'sticker':
                        await EventHandler.stickerEventHandler(event, client);
                    case 'file':
                        await EventHandler.fileEventHandler(event, client);
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
            }
            // Return an error message.
            return res.status(500).json({
                status: 'error',
            });
        }
      })
    );

    // Return a successfull message.
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

// Create a server and listen to it.
app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});