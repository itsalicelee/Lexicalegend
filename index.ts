// Import all dependencies, mostly using destructuring for better view.
import { ClientConfig, Client, middleware, MiddlewareConfig, WebhookEvent} from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';
import * as EventHandler from './src/event-handler';

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
            switch(event.type){
                case 'follow':{
                    await EventHandler.followEventHandler(event, client);
                    break;
                }
                case 'message':{
                    if(event.message.type === 'text'){
                        await EventHandler.textEventHandler(event, client);
                    }
                    else if(event.message.type === 'image'){
                        await EventHandler.imageEventHandler(event, client);
                    }
                    else if(event.message.type === 'audio'){
                        await EventHandler.audioEventHandler(event, client);
                    }
                    else if(event.message.type === 'location'){
                        await EventHandler.locationEventHandler(event, client);
                    }
                    else if(event.message.type === 'file'){
                        await EventHandler.fileEventHandler(event, client);
                    }
                    else if(event.message.type === 'sticker'){
                        await EventHandler.stickerEventHandler(event, client);
                    }
                    else if(event.message.type === 'video'){
                        await EventHandler.videoEventHandler(event, client);
                    }
                    break;
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