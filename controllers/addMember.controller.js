import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import Utilizer from "../models/utilizer.model.js";
import compareBcryptHashPassword from '../helpers/compareBryptHash.js'

const addMemberController = async (req, res) => {
    if (!req.MoveOnStatus) {
        return res.json({ message: 'You should have login first.', status: 404 });
    }
    
    if (!req.isChatExist) {
        return res.json({ message: 'Group does not exist.', status: 404 });
    }

    try {
        let isAdmin = req.chat.creator.toString();
        let userID = req.user._id.toString();

        if (isAdmin !== userID) {
            return res.json({ message: 'Only admin can update group, you can only exit the group.', status: 404 });
        }

        let { newMembers } = req.body;

        if (!newMembers || !Array.isArray(newMembers) || newMembers.length === 0) {
            return res.json({ message: 'Please select at least one user', status: 404 });
        }

        let chat = req.chat;
        chat.members = [...new Set([...chat.members, ...newMembers])]; // Avoid duplicates
        await chat.save();

        for (const newMem of newMembers) {
            let newMemberData = await Utilizer.findById(newMem);
            if (!newMemberData) continue; // Handle case where user not found

            let chatID = chat._id.toString();
            if (!newMemberData.chats.includes(chatID)) {
                newMemberData.chats.unshift(chat._id);
                await newMemberData.save();
            }

            let newMemIndex = chat.requests.indexOf(newMem);
            if (newMemIndex >= 0) {
                chat.requests.splice(newMemIndex, 1);
                await chat.save();
            }
        }

        chat = await Chat.findOne({_id: chat._id}).populate([
            { path: 'members', select: ['username', 'email', '_id', 'dp'] },
            { path: 'requests', select: ['username', 'email', '_id', 'dp'] },
        ]);
        let latestMessage = await Message.findOne({ _id: chat.latestMessage }).populate([
            { path: 'sentBy', select: ['username', 'email', '_id', 'dp'] },
        ]);

        res.json({ message: 'This group has been updated.', status: 200, chat, latestMessage });
    } catch (error) {
        console.error("ADDING THE GROUP MEMBER ERROR: ", error.message);
        res.json({ message: 'Something went wrong.', status: 404 });
    }
};


export default addMemberController;