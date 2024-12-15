import Chat from '../models/chat.model.js'
import Message from '../models/message.model.js'
import Utilizer from '../models/utilizer.model.js'

const UnblockUserController = async (req, res) => {
    try {
        if(req.MoveOnStatus){
            if (Object.keys(req.query).length > 0) {
                let userID = req.user._id.toString();
                let otherUser = await Utilizer.findOne({_id: req.query.id});
                if(otherUser){
                    let userIncludes = otherUser.blockedBy.includes(userID);
                    let userIndex = otherUser.blockedBy.indexOf(userID);
                    console.log("userIncludes && userIndex: ", userIncludes, userIndex)
                    if(userIncludes && userIndex >= 0){
                        otherUser.blockedBy.splice(userIndex, 1);
                        await otherUser.save();
                    }
                    let otherUserIncludes = req.user.blockedUsers.includes(req.query.id);
                    let otherUserIndex = req.user.blockedUsers.indexOf(req.query.id);
                    console.log("otherUserIncludes && otherUserIndex: ", otherUserIncludes, otherUserIndex)
                    if(otherUserIncludes && otherUserIndex >= 0){
                        req.user.blockedUsers.splice(otherUserIndex, 1);
                        await req.user.save();
                    }
                    res.json({message: 'This user has been unblocked.', status: 200, otherUser});
                } else res.json({message: 'This user is not valid.', status: 404});
            } else res.json({message: 'This user is not valid.', status: 404});
        } else res.json({message: 'You should have login first.', status: 404});
    } catch (error) {
        console.log("UNBLOCK USER CONTROLLER ERROR: ", error.message);
        res.json({message: 'Something went wrong', status: 404});
    }
}

export default UnblockUserController;