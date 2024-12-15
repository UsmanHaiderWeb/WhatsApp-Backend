import Utilizer from "../models/utilizer.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import verifyJwtToken from "../helpers/verifyJwtToken.js";

let graphqlResolvers = {
    User: {
        chats: async (parent) => {
            let populatedUser =  await parent.populate('chats');
            return populatedUser.chats;
        },
        friends: async (parent) => {
            let populatedUser = await parent.populate('friends');
            return populatedUser.friends;
        },
        blockedUsers: async (parent) => {
            let populatedUser = await parent.populate('blockedUsers');
            return populatedUser.blockedUsers;
        },
        notifications: async (parent) => {
            let populatedUser = await parent.populate('notifications');
            return populatedUser.notifications;
        },
    },
    Chat: {
        creator: async (parent) => await Utilizer.findOne({_id: parent.creator}),
        chatWith: async (parent) => await Utilizer.findOne({_id: parent.chatWith}),
        latestMessage: async (parent) => await Message.findOne({_id: parent.latestMessage}),
        chatBlockedBy: async (parent) => await Utilizer.findOne({_id: parent.chatBlockedBy}),
        admin: async (parent) => {
            let populatedChat = await parent.populate('admin');
            return populatedChat.admin;
        },
        members: async (parent) => {
            let populatedChat = await parent.populate('members');
            return populatedChat.members;
        },
        requests: async (parent) => {
            let populatedChat = await parent.populate('requests');
            return populatedChat.requests;
        },
        messages: async (parent) => {
            let populatedChat = await parent.populate('messages');
            return populatedChat.messages;
        },
    },
    Message: {
        sentBy: async (parent) => await Utilizer.findOne({_id: parent.sentBy}),
        chatID: async (parent) => await Chat.findOne({_id: parent.chatID}),
    },
    Query: {
        getUsers: async () => await Utilizer.find({isVerified: true}),
        getSingleUser: async (parent, {id, isToken}) => {
            let userID;
            if (isToken) {
                userID = await verifyJwtToken(id);
            } else {
                userID = id;
            }
            let user = await Utilizer.findOne({_id: userID});
            return user;
        },
        isChatExist: async (parent, {id}) => {
            try{
                let chat = await Chat.findOne({_id: id});
                return chat
            } catch (err) {
                console.log("CHECKING THAT TE CHAT EXISTS: ", err.message);
                return false;
            }
        },
        getAllGroups: async () => {
            try {
                let chats = await Chat.find({isGroupChat: true});
                return chats
            } catch (err) {
                console.log("GETTING ALL GROUP CHATS ERROR: ", err.message);
                return false;
            }
        },
    },
    Mutation: {
        sendRequestToGroup: async (parent, {token, id}) => {
            try{
                let userId = await verifyJwtToken(token);
                if (userId) {
                    let groupChat = await Chat.findOne({_id: id});
                    console.log("groupChat.requests: ", groupChat.requests);
                    let includes = groupChat.requests.includes(userId.toString());
                    let index = groupChat.requests.indexOf(userId.toString());
                    console.log("includes && index: ", includes, index);
                    if(!includes && index < 0){
                        groupChat.requests?.unshift(userId);
                        await groupChat.save();
                    }
                    return groupChat;
                } else {
                    return null;
                }
            } catch (err) {
                console.log("SEND REQUEST ERROR: ", err.message);
                return null;
            }
        }
    }
}

export default graphqlResolvers;