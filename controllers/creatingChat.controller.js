import Chat from '../models/chat.model.js'
import Utilizer from '../models/utilizer.model.js';
import compareBcryptHashPassword from '../helpers/compareBryptHash.js'

const CreatingChatController = async (req, res) => {
    try {
        if(req.MoveOnStatus){
            if (Object.keys(req.query).length > 0 && Object.keys(req.body).length > 0) {
                let { password } = req.body;
                let userID = req.user._id.toString();
                let passwordCheckResult = await compareBcryptHashPassword(password, req.user.password);
                if(!passwordCheckResult){
                    return res.json({message: 'Enter correct Password', error: {password: 'Enter correct Password'}, status: 404});
                }
                let otherUser = await Utilizer.findOne({_id: req.query.id});
                if (!otherUser) {
                    return res.json({message: 'Try to chat with a valid User.', status: 404});
                }
                let userIncludes = otherUser.blockedUsers.includes(userID);
                if(userIncludes){
                    return res.json({message: 'You have already been blocked by this user. So you cant chat with this user.', status: 404});
                }

                let chat = await Chat.findOne({
                    isGroupChat: false,
                    members: { $all: [req.user._id, otherUser._id] }
                });
                if(chat){
                    let populatedChat = await Chat.findOne({_id: chat._id}).populate({path: 'admin', select: ['username', 'email', 'dp']});
                    console.log("chatData: ", populatedChat)
                    return res.json({message: 'Chat has already been created.', status: 200, chat: populatedChat});
                } else {
                    let adimns_Members = [req.user._id, otherUser._id];
                    chat = await Chat.create({
                        chatWith: otherUser._id,
                        admin: adimns_Members,
                        members: adimns_Members,
                    })
                    req.user.friends.unshift(req.query.id);
                    req.user.chats.unshift(chat._id);
                    await req.user.save();
                    otherUser.friends.unshift(req.user._id);
                    otherUser.chats.unshift(chat._id);
                    await otherUser.save();
                    let populatedChat = await Chat.findOne({_id: chat._id}).populate({path: 'admin', select: ['username', 'email', 'dp']});
                    res.json({message: 'Chat has been created.', status: 200, chat: populatedChat});
                }
            }
        } else res.json({message: "User need to login first.", status: 404})
    } catch (error) {
        console.log("CREATING MESSAGE CONTROLLER ERROR: ", error.message);
        res.json({message: 'Something went wrong', status: 404});
    }
}

export default CreatingChatController;