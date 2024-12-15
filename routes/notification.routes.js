import express from 'express'
import authenticate from '../middlewares/authenticate.middleware.js'
import deleteNotificationController from '../controllers/deleteNotification.controller.js';
import deleteAllNotificationController from '../controllers/deleteAllNotifications.controller.js';

const notifyRouter = express();


notifyRouter.post('/notification/delete', authenticate, deleteNotificationController);
notifyRouter.post('/notification/delete/many', authenticate, deleteAllNotificationController);


export default notifyRouter;