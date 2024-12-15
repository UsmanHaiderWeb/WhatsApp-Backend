import compareBcryptHashPassword from "../helpers/compareBryptHash.js";
import generateBcryptHash from "../helpers/generateBcryptHash.js";
import validator from 'validator'

const renameGroupController = async (req, res) => {
    if (req.MoveOnStatus) {
        if(req.isChatExist){
            try {
                let isAdmin = req.chat.creator.toString();
                let userID = req.user._id.toString();
                if(isAdmin == userID){
                    if(Object.keys(req.body).length > 0){
                        let { password, chatName } = req.body;
                        let user = req.user;
                        let passwordCheckResult = await compareBcryptHashPassword(password, user.password);
                        if(passwordCheckResult) {
                            req.chat.chatName = chatName;
                            await req.chat.save();
                            res.json({message: "Group name has been updated.", chat: req.chat, status: 200})
                        } else res.json({error: {oldPassword: 'Please enter correct password.'}, status: 404})
                    } else res.json({message: 'Data is missing', status: 404})
                } else res.json({message: 'Only admin can update group, you can only exit the group.', status: 404})
            } catch (error) {
                console.log("editProfileController ERROR: ", error.message);
                res.json({message: 'Something went wrong.', status: 404})
            }
        } else res.json({message: 'Group does not exist.', status: 404})
    } else res.json({message: 'Please make sure that you are logged in.', status: 404})
}

export default renameGroupController;