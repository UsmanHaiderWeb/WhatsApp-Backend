import express from 'express'
import authenticate from '../middlewares/authenticate.middleware.js'
import CreatingChatController from '../controllers/creatingChat.controller.js';
import CreatingGroupChatController from '../controllers/creatingGroupChat.controller.js';
import isChatExistMiddleware from '../middlewares/IsChatExist.js';
import deleteGroupController from '../controllers/deleteGroup.js';
import addMemberController from '../controllers/addMember.controller.js';
import exitGroupController from '../controllers/exitGroup.controller.js';
import renameGroupController from '../controllers/renameGroup.controller.js';
import remveMemberGroupController from '../controllers/remveMemberGroup.controller.js';
import upload from '../helpers/multerMemory.js';

const chatRouter = express();

chatRouter.post('/chat/create', [authenticate, isChatExistMiddleware], CreatingChatController);
chatRouter.post('/chat/group/create', [ authenticate, upload.single('dp') ], CreatingGroupChatController);
chatRouter.put('/chat/group/delete', [authenticate, isChatExistMiddleware], deleteGroupController);
chatRouter.post('/chat/group/addmember', [authenticate, isChatExistMiddleware], addMemberController);
chatRouter.post('/chat/group/removemember', [authenticate, isChatExistMiddleware], remveMemberGroupController);
chatRouter.post('/chat/group/rename', [authenticate, isChatExistMiddleware], renameGroupController);
chatRouter.put('/chat/group/exit', [authenticate, isChatExistMiddleware], exitGroupController);

export default chatRouter;