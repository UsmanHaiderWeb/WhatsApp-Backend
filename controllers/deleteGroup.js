import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Utilizer from "../models/utilizer.model.js";

const deleteGroupController = async (req, res) => {
    if(req.MoveOnStatus){
        if(req.isChatExist){
            try {
                let isAdmin = req.chat.creator.toString();
                let userID = req.user._id.toString();
                if(isAdmin == userID){
                    let messages = await Message.find();
                    messages.forEach(async (e) => {
                        await Message.findOneAndDelete({_id: e._id});
                    });
                    req.chat.members.forEach(async (e) => {
                        let member = await Utilizer.findOne({_id: e._id});
                        let chatIndex = member.chats.indexOf(req.chat);
                        if(chatIndex >= 0){
                            await user.chats.splice(chatIndex, 1);
                            await user.save();
                        }
                    });
                    let deletedGroup = await Chat.findOneAndDelete({_id: req.chat._id});
                    res.json({message: 'This group has been deleted permanently.', status: 200, deletedGroup})
                } else res.json({message: 'Only admin can delete group, you can only exit the group.', status: 404})
            } catch (error) {
                console.log("CHECKING THE CHAT EXISTS MIDDLEWARE: ", error?.message);
                res.json({message: 'Something went wrong.', status: 404})
            }
        } else res.json({message: 'Group does not exist.', status: 404})
    } else res.json({message: 'You should have login first.', status: 404})
}

export default deleteGroupController;