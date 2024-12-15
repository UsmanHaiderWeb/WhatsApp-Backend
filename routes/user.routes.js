import express from 'express'
import authenticate from '../middlewares/authenticate.middleware.js';
import signupController from '../controllers/signup.controller.js';
import Utilizer from '../models/utilizer.model.js';
import Notification from '../models/notification.model.js';
import loginController from '../controllers/login.controller.js';
import isLoggedInController from '../controllers/IsLoggedin.controller.js';
import OtpVerificationController from '../controllers/OtpVerification.controller.js';
import OtpLoginController from '../controllers/OtpLogin.controller.js';
import upload from '../helpers/multerMemory.js';
import nodeMailerSendingEmails from '../helpers/nodeMailer.js';
import generateBcryptHash from '../helpers/generateBcryptHash.js';
import generateToken from '../helpers/generateToken.js';
import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import editProfileController from '../controllers/editProfile.controller.js';
import blockUserController from '../controllers/blockUser.controller.js';
import UnfriendUserController from '../controllers/UnfriendUser.controller.js';
import isChatExistMiddleware from '../middlewares/IsChatExist.js';
import UnblockUserController from '../controllers/UnblockUser.controller.js';

const userRouter = express();


userRouter.post('/signup', upload.single('dp'), signupController);
userRouter.post('/login', loginController);
userRouter.post('/user/verification', OtpVerificationController);
userRouter.post('/user/login/verification', OtpLoginController);
userRouter.get('/user/isloggedin', authenticate, isLoggedInController);
userRouter.post('/user/edit/profile', [ authenticate, upload.single('dp')], editProfileController);
userRouter.post('/user/block', [authenticate, isChatExistMiddleware], blockUserController)
userRouter.put('/user/unblock', authenticate, UnblockUserController);
userRouter.post('/user/unfriend', [authenticate, isChatExistMiddleware], UnfriendUserController)






userRouter.get('/check', async (req, res) => {
    // let users = await Utilizer.find({isVerified: true});
    // let users = await Utilizer.findOne({email: 'zain@gmail.com'});
    let users = await Chat.find();
    // let users = await Notification.find();
    // let users = await Message.find();
    // let hash = await generateBcryptHash('Recruiter#12')
    // let users = await Utilizer.create({
        // "username": "Bilal ahmad",
    //     "email": "bilal@gmail.com",
    //     "password": hash,
    //     "dp": "https://res.cloudinary.com/duffdfh2k/image/upload/v1728719070/zwdbh9lc9f0cav7hounl.png",
    //     "isVerified": true,
    //     "verifiedToken": "544545",
    //     "loginToken": "358534"
    // });
    // await nodeMailerSendingEmails('email@gmail.com', 'jgjks', 'simple');
    // let token = await generateToken(users._id);
    // console.log(token);

    // let chat = await Chat.findOne({admins: [req.user._id, req.query.id]});

    // users.chats = [];
    // users.friends = [];
    // await users.save()

    // users.forEach(async (e) => {
    //     e.chats = []
    //     e.blockedBy = []
    //     e.blockedUsers = []
    //     e.friends = []
    //     e.notifications = []
    //     e.allMessages = []
    //     await e.save();
    // })


    // users.forEach(async (e) => {
    //     await Notification.findOneAndDelete({_id: e._id});
    // })

    


    res.send(users);
});


export default userRouter;