import express from 'express'
import authenticate from '../middlewares/authenticate.middleware.js'
import CreateMessageController from '../controllers/createMessage.controller.js';
import isChatExistMiddleware from '../middlewares/IsChatExist.js';

const messRouter = express();


messRouter.post('/message/create', [ authenticate, isChatExistMiddleware], CreateMessageController);


export default messRouter;