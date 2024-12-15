import Message from '../models/message.model.js'
import Notification from '../models/notification.model.js'

const CreateMessageController = async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0) {
            if (req.MoveOnStatus && req.isChatExist) {
                let chat = req.chat;
                let { content } = req.body;
                if (content) {
                    let message = await Message.create({
                        content,
                        sentBy: req.user._id,
                        isRelatedToAnyGroup: chat.isGroupChat,
                        chatID: chat._id,
                    })
                    chat.messages.push(message._id);
                    await chat.save();
                    chat.latestMessage = message._id;
                    await chat.save();
                    let populatedMessage = await Message.findOne({_id: message._id}).populate({path: 'sentBy', select: ['username', 'email', 'dp']})
                    res.json({message: 'Your message has been sent.', status: 200, messageData: populatedMessage})
                } else throw new Error('Message data is missing.');
            } else throw new Error('Something went wrong.');
        } else throw new Error('Users data is missing.');
    } catch (error) {
        console.log("CREATING MESSAGE CONTROLLER ERROR: ", error.message);
        res.json({message: error.message, status: 404});
    }
}

export default CreateMessageController;