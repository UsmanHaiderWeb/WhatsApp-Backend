import Chat from "../models/chat.model.js";

const isChatExistMiddleware = async (req, res, next) => {
    try {
        if(req.MoveOnStatus){
            let user = req.user;
            let chat = await Chat.findOne({_id: req.query.id});
            if (chat) {
                req.isChatExist = true;
                req.chat = chat;
            } else {
                req.isChatExist = false;
            }
        }
    } catch (error) {
        console.log("CHECKING THE CHAT EXISTS MIDDLEWARE: ", error?.message);
        req.isChatExist = false;
    }
    next();
}

export default isChatExistMiddleware;