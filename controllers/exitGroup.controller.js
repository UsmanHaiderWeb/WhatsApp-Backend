import Message from "../models/message.model.js";

const exitGroupController = async (req, res) => {
    if(req.MoveOnStatus){
        if(req.isChatExist){
            try {
                let chatIndex = req.user.chats.indexOf(req.chat._id);
                if(chatIndex >= 0){
                    await req.user.chats.splice(chatIndex, 1);
                    await req.user.save();
                }
                let memberIndex = req.chat.members.indexOf(req.user._id);
                if(memberIndex >= 0){
                    await req.chat.members.splice(memberIndex, 1);
                    await req.chat.save();
                }
                res.json({message: 'You are no longer member of this group.', status: 200, exitGroup: req.chat, leavingMessage})
            } catch (error) {
                console.log("CHECKING THE CHAT EXISTS MIDDLEWARE: ", error?.message);
                res.json({message: 'Something went wrong.', status: 404})
            }
        } else res.json({message: 'Group does not exist.', status: 404})
    } else res.json({message: 'You should have login first.', status: 404})
}

export default exitGroupController