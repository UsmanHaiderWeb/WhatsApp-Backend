import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Utilizer from "../models/utilizer.model.js";
import compareBcryptHashPassword from '../helpers/compareBryptHash.js'

const UnfriendUserController = async (req, res) => {
    try{
        if (req.MoveOnStatus) {
            if (req.isChatExist) {
                if (Object.keys(req.body).length <= 0) {
                    return res.json({message: 'Enter correct Password', error: {password: 'Enter correct Password'}, status: 404});
                }
                let { password } = req.body;
                let passwordCheckResult = await compareBcryptHashPassword(password, req.user.password);
                if(!passwordCheckResult){
                    return res.json({message: 'Enter correct Password', error: {password: 'Enter correct Password'}, status: 404});
                }
                let otherMemberArray = req.chat?.members.filter((user) => {
                    let otherUserId = user.toString();
                    let userId = req.user._id.toString()
                    return otherUserId != userId
                })
                let otherUser = await Utilizer.findOne({_id: otherMemberArray[0]});
                if (otherUser) {
                    let chatId = req.chat._id;
                    let indexinChat = otherUser.chats.indexOf(chatId);
                    let indexInFriendList = otherUser.friends.indexOf(req.user._id);
                    if (indexinChat >= 0 || indexInFriendList >= 0) {
                        indexinChat >= 0 && otherUser.chats.splice(indexinChat, 1);
                        await otherUser.save();
                        indexInFriendList >= 0 && otherUser.friends.splice(indexInFriendList, 1);
                        await otherUser.save();
                    }
                    indexinChat = req.user.chats.indexOf(chatId);
                    indexInFriendList = req.user.friends.indexOf(otherUser._id);
                    if (indexinChat >= 0 || indexInFriendList >= 0) {
                        indexInFriendList >= 0 && req.user.friends.splice(indexInFriendList, 1);
                        await req.user.save();
                        indexinChat >= 0 && req.user.chats.splice(indexinChat, 1);
                        await req.user.save();
                    }
                    // delete messages related to chat
                    let messages = await Message.find({chatID: req.chat._id});
                    messages.forEach(async (element) => {
                        console.log("element?.content: ", element?.content);
                        await Message.findOneAndDelete({_id: element._id});
                    });
                    // delete chat
                    let deletedChat = await Chat.findOneAndDelete({_id: req.chat._id});
                    res.json({message: "This is has been blocked.", status: 200, chatID: deletedChat._id, chat: deletedChat, otherUser: otherUser._id});
                } else res.json({message: "Something went wrong.", status: 404})
            } else res.json({message: "This user has already blocked you or been blocked by you, or might be something went wrong.", status: 404})
        } else res.json({message: "You should have login first.", status: 404})
    } catch (error) {
        console.log("BLOCK THE USER CONTROLLER ERROR: ", error.message);
        res.json({message: "Something went wrong.", status: 404});
    }
}

export default UnfriendUserController;