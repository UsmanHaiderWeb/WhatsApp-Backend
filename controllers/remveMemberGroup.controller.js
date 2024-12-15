import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Utilizer from "../models/utilizer.model.js";

const remveMemberGroupController = async (req, res) => {
    if(req.MoveOnStatus){
        if(req.isChatExist){
            try {
                let isAdmin = req.chat.creator.toString();
                let userID = req.user._id.toString();
                if(isAdmin == userID){
                    let {removeMembers} = req.body;
                    removeMembers?.forEach(async (remover) => {
                        let removerId = remover.toString();
                        let includes = req.chat.members.includes(removerId);
                        let index = req.chat.members.indexOf(removerId);
                        console.log("chatData", includes, index)
                        if(includes && index >= 0){
                            req.chat.members.splice(index, 1);
                            let removerUser = await Utilizer.findOne({_id: removerId});
                            console.log("removerUser", removerUser.username);
                            let chatID = req.chat._id.toString();
                            let chatIncludes = removerUser.chats.includes(chatID);
                            let chatIndex = removerUser.chats.indexOf(chatID);
                            console.log("chatData", chatIncludes, chatIndex)
                            if(chatIncludes && chatIndex >= 0){
                                removerUser.chats.splice(chatIndex, 1);
                                await removerUser.save()
                            }
                        }
                    })
                    await req.chat.save();
                    let updatedGroup = await Chat.findOne({_id: req.chat._id}).populate([
                        {path: 'members', select: ['username', 'email', '_id', 'dp']},
                    ]);
                    let latestMessage = await Message.findOne({_id: updatedGroup.latestMessage}).populate([
                        {path: 'sentBy', select: ['username', 'email', '_id', 'dp']},
                    ])
                    res.json({message: 'This group has been updated.', status: 200, updatedGroup, latestMessage})
                } else res.json({message: 'Only admin can update group, you can only exit the group.', status: 404})
            } catch (error) {
                console.log("REMOVING A GROUP MEMBER ERROR: ", error?.message);
                res.json({message: 'Something went wrong.', status: 404})
            }
        } else res.json({message: 'Group does not exist.', status: 404})
    } else res.json({message: 'You should have login first.', status: 404})
}

export default remveMemberGroupController;