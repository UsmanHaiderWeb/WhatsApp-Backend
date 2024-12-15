import express from "express";
import DB_Conection from "./config/db-coonection.js";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4'
import userRouter from "./routes/user.routes.js";
import helmet from 'helmet'
import dotenv from 'dotenv'
import messRouter from "./routes/message.routes.js";
import chatRouter from "./routes/chat.routes.js";
import typeDefs from "./Graphql/typeDefs_queries.js";
import graphqlResolvers from "./Graphql/AllResolvers.js";
import { Server } from "socket.io";
import http from 'http';
import Utilizer from "./models/utilizer.model.js";
import Chat from "./models/chat.model.js";
import Notification from "./models/notification.model.js";
import verifyJwtToken from "./helpers/verifyJwtToken.js";
import notifyRouter from "./routes/notification.routes.js";

async function appRunning() {
    try {
        const app = express();
        DB_Conection();

        app.use(express.json());
        app.use(express.urlencoded({extended: true}));
        app.use(cors({
            origin: '*',
            method: ["GET", "PATCH", "DELETE", "PUT", "POST"],
            credentials: true
        }))
        app.use(helmet());
        dotenv.config();

    
        app.get('/', (_, res) => {
            res.send('Welcome to WhatsApp')
        })
    
        const graphqlServer = new ApolloServer({
            typeDefs: typeDefs,
            resolvers: graphqlResolvers
        })

        await graphqlServer.start();

        app.use('/graphql', expressMiddleware(graphqlServer));
        app.use('/api', userRouter);
        app.use('/api', messRouter);
        app.use('/api', chatRouter);
        app.use('/api', notifyRouter);

        const httpServer = http.createServer(app);

        const io = new Server(httpServer, {
            cors: {
                origin: '*'
            }
        });

        const users = {};
        io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                let userID = Object.keys(users).find(key => users[key] === socket.id);
                if(userID) delete users[userID];
            })
            
            socket.on('joinMember', async (token) => {
                let userID = await verifyJwtToken(token);
                users[userID] = socket.id;
                console.log("User has joined: ", users[userID]);
            });
            
            socket.on('isConnected', async ({chatID}) => {
                try {
                    let chat = await Chat.findOne({_id: messageData?.chatID}).populate('members');
                    chat.members.forEach(user => {
                        let id = user._id.toString();
                        socket.to(id).emit('toggleConnection', {isConnected: true, chatID: chat._id});
                    });
                } catch (error) {
                    console.error('Error in IsConnected handler: ', error);
                }
            });
        
            socket.on('newMessage', async ({messageData, leavingMessage}) => {
                try {
                    let chat = await Chat.findOne({_id: messageData?.chatID}).populate('members');
                    for (let member of chat.members){
                        let notification = await Notification.create({
                            content: messageData.content,
                            chatID: chat._id,
                            isNotifiedMessage: false
                        })
                        let memberData = await Utilizer.findOne({_id: member});
                        memberData.notifications.unshift(notification._id);
                        memberData.allMessages.unshift(messageData._id);
                        await memberData.save()
                        let id = memberData._id.toString();
                        if(id != messageData.sentBy.toString()){
                            let recepientSocketID = users[id];
                            io.to(recepientSocketID).emit('receiveMessage', {messageData, chatID: chat._id, notification, leavingMessage});
                        }
                    }
                } catch (error) {
                    console.error('Error in newMessage handler: ', error);
                }
            });
            
            socket.on('clearNotification', async ({chatID, userID}) => {
                try {
                    let user;
                    try {
                        user = await Utilizer.findOne({_id: userID}).populate('notifications');
                    } catch (error) {
                    }
                    if(!user){
                        let userIDFromToken = await verifyJwtToken(userID);
                        user = await Utilizer.findOne({_id: userIDFromToken}).populate('notifications');
                    }
                    let filteredNotificationArray = user.notifications.filter(noti => {
                        if(noti.chatID != chatID){
                            return true;
                        } else if (noti.chatID == chatID) {
                            if(!noti.isNotifiedMessage){
                                return false
                            } else return true
                        }
                    })
                    user.notifications = filteredNotificationArray;
                    await user.save()
                    io.emit('filteredNotificationArray', {notifications: user.notifications});
                } catch (error) {
                    console.log('clearing notifications socket io error: ', error.message);
                }
            })

            socket.on('typing', async ({isTyping, chatID, userID}) => {
                try {
                    let chat = await Chat.findOne({_id: chatID}).populate('members');
                    !chat.isGroupChat && chat.members.forEach((member, idx) => {
                        let id = member._id.toString();
                        if(userID != id){
                            let recipientSocketId = users[id];
                            socket.to(recipientSocketId).emit('showTypingLoader', {showTypingLoader: isTyping, chatID});
                        }
                    });
                } catch (error) {
                    console.error('Error in Typing handler: ', error);
                }
            })

            socket.on('new chat created', async ({chatID, userID}) => {
                try{
                    let chat = await Chat.findOne({_id: chatID}).populate([
                        {path: 'admin', select: ['username', '_id', 'email', 'dp']},
                        {path: 'members', select: ['username', '_id', 'email', 'dp']}
                    ]);
                    let user = await Utilizer.findOne({_id: userID});
                    console.log("working");
                    let notification = await Notification.create({
                        content: chat.isGroupChat ? `${chat.chatName}: a new group created by ${user.username}.` : `${user.username} created a new chat room.`,
                        chatID,
                        isNotifiedMessage: true
                    })
                    console.log("notification._id: ", notification._id);
                    for(const member of chat.members) {
                        let memberID = member._id.toString();
                        if (memberID.toString() != userID) {
                            console.log("memberID.toString() != userID: ", memberID.toString() != userID);
                            let memberUtilizerFound = await Utilizer.findOne({_id: memberID});
                            if (memberUtilizerFound) {
                                console.log("memberUtilizerFound.notifications.length: ", memberUtilizerFound.notifications.length)
                                memberUtilizerFound.notifications.unshift(notification._id);
                                await memberUtilizerFound.save(); 
                                console.log("memberUtilizerFound.notifications.length: ", memberUtilizerFound.notifications.length)
                            }
                            let memberSocketID = users[memberID];
                            io.to(memberSocketID).emit('emitting new chat', {chat, notification});
                        }
                    }
                } catch (err) {
                    console.log('NEW CHAT SOCKET ERROR: ', err.message);
                }
            })

            socket.on('unfriend User', async ({userID, chat}) => {
                try{
                    let user = await Utilizer.findOne({_id: userID});
                    let notification = await Notification.create({
                        content: chat.isGroupChat ? `${chat.chatName}: This group has been deleted by the admin ${user.username}.` : `${user.username} has unfriend you.`,
                        chatID: chat?._id,
                        isNotifiedMessage: true
                    })
                    for(const member of chat.members) {
                        let memberID = member._id ? member._id.toString() : member.toString();
                        let memberUtilizerFound = await Utilizer.findOne({_id: memberID});
                        if (memberID.toString() != userID) {
                            if (memberUtilizerFound) {
                                memberUtilizerFound.notifications.unshift(notification._id);
                                await memberUtilizerFound.save(); 
                            }
                            let memberSocketID = users[memberID];
                            io.to(memberSocketID).emit('remove Chat', {chat, notification});
                        }
                    }
                } catch (err) {
                    console.log('NEW CHAT SOCKET ERROR: ', err.message);
                }
            })

            socket.on('block User', async ({userID, chat}) => {
                try{
                    let user = await Utilizer.findOne({_id: userID});
                    let notification = await Notification.create({
                        content: `${user.username} has blocked you.`,
                        chatID: chat?._id,
                        isNotifiedMessage: true
                    })
                    for(const member of chat.members) {
                        let memberID = member._id ? member._id.toString() : member.toString();
                        let memberUtilizerFound = await Utilizer.findOne({_id: memberID}).select(['username', 'email', 'dp', '_id', 'caption']);
                        if (memberID.toString() != userID) {
                            if (memberUtilizerFound) {
                                memberUtilizerFound.notifications.unshift(notification._id);
                                await memberUtilizerFound.save(); 
                            }
                            console.log("memberID.toString() != userID: ", memberID.toString() != userID)
                            let memberSocketID = users[memberID];
                            io.to(memberSocketID).emit('remove Chat', {chat, notification});
                        }
                    }
                } catch (err) {
                    console.log('NEW CHAT SOCKET ERROR: ', err.message);
                }
            })

            socket.on('addMembers', async ({chatID, userID, members, isRequest}) => {
                try{
                    let user = await Utilizer.findOne({_id: userID});
                    let chat = await Chat.findOne({_id: chatID});
                    let notification = await Notification.create({
                        content: !isRequest ? `${chat.chatName}: ${user.username} (admin) had added you to this group.` : `${chat.chatName}: your request has been accepted.`,
                        chatID,
                        isNotifiedMessage: true
                    })
                    for(const memberID of members) {
                        let memberUtilizerFound = await Utilizer.findOne({_id: memberID});
                        if (memberUtilizerFound) {
                            memberUtilizerFound.notifications.unshift(notification._id);
                            await memberUtilizerFound.save(); 
                        }
                        if (memberID.toString() != userID) {
                            let memberSocketID = users[memberID];
                            io.to(memberSocketID).emit('emitting new chat', {chat, notification});
                        }
                    }
                } catch (err) {
                    console.log('NEW CHAT SOCKET ERROR: ', err.message);
                }
            })

            socket.on('removeMembers', async ({chatID, userID, members}) => {
                try{
                    let user = await Utilizer.findOne({_id: userID});
                    let chat = await Chat.findOne({_id: chatID});
                    let notification = await Notification.create({
                        content: `${chat.chatName}: ${user.username} (admin) had removed you from this group.`,
                        chatID,
                        isNotifiedMessage: true
                    })
                    for(const memberID of members) {
                        let memberUtilizerFound = await Utilizer.findOne({_id: memberID});
                        if (memberUtilizerFound) {
                            memberUtilizerFound.notifications.unshift(notification._id);
                            await memberUtilizerFound.save(); 
                        }
                        if (memberID.toString() != userID) {
                            let memberSocketID = users[memberID];
                            io.to(memberSocketID).emit('remove Chat', {chat, notification});
                        }
                    }
                } catch (err) {
                    console.log('NEW CHAT SOCKET ERROR: ', err.message);
                }
            })

        });


        httpServer.listen(process.env.PORT || 3000, () => {
            console.log("Server is running on port 3000");
        })


    } catch (error) {
        console.log('APP RUNNING ERROR: ', error.message);
    }
}

appRunning();