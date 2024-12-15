import Chat from "../models/chat.model.js";
import uploadOnCloudnary from "../helpers/UploadOnCloudinary.js";
import Utilizer from "../models/utilizer.model.js";

const CreatingGroupChatController = async (req, res) => {
    try {
        if(req.MoveOnStatus){
            if (Object.keys(req.body).length > 0) {
                let {chatName, members} = req.body;
                let groupMembers = members.split(',')
                if (groupMembers.length > 1) {
                    let isGroupExist = await Chat.findOne({chatName: chatName, isGroupChat: true});
                    console.log("isGroupExist: ", isGroupExist);
                    if(isGroupExist){
                        return res.json({message: 'Group name is not available.', status: 404});
                    }
                    let response = await uploadOnCloudnary(req?.file?.buffer);
                    if (!response?.secure_url) {
                        return res.json({ message: 'Failed to upload image on cloudinary.', status: 404});
                    }
                    let chat = await Chat.create({
                        chatName: chatName,
                        isGroupChat: true,
                        creator: req.user._id,
                        dp: response?.secure_url,
                        admin: [req.user._id],
                        members: [req.user._id, ...groupMembers],
                    })
                    let populatedChat = await Chat.findOne({_id: chat.id}).populate(
                        {path: 'creator', select: ['username', 'email', 'dp']},
                    )
                    chat.members.forEach(async (i) => {
                        let user = await Utilizer.findOne({_id: i});
                        user.chats.unshift(chat._id);
                        user.save();
                    })
                    await chat.save();
                    res.json({message: 'Chat has been created.', status: 200, chat: populatedChat});
                } else res.json({message: "At least three users including you, are required to create a group chat.", status: 404})
            } else res.json({message: "Data is missing.", status: 404})
        } else res.json({message: "User need to login first.", status: 404})
    } catch (error) {
        console.log("CREATING GROUP ERROR: ", error.message);
        res.json({message: "Something went wrong.", status: 404})
    }
}

export default CreatingGroupChatController;