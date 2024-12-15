import generateBcryptHash from "../helpers/generateBcryptHash.js";
import uploadOnCloudnary from "../helpers/UploadOnCloudinary.js";
import Utilizer from "../models/utilizer.model.js";
import Chat from "../models/chat.model.js";
import validator from 'validator'
import nodeMailerSendingEmails from '../helpers/nodeMailer.js'

const signupController = async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0 && req.file) {
            let { username, email, password, caption } = req.body
            if(!validator.isEmail(email)){
                return res.json({message: 'Email is invalid.', error: {email: 'Email is invalid.'}, status: 404});
            }
            if(!validator.isStrongPassword(password)){
                return res.json({message: 'Password is too weak.', error: {password: '1 upper, 1 lowercase, 1 special character, 8 characters in total'}, status: 404});
            }
            let user = await Utilizer.findOne({email});
            if(!user){
                let response = await uploadOnCloudnary(req?.file?.buffer);
                if (response?.secure_url) {
                    let hash = await generateBcryptHash(password);
                    if (hash) {
                        user = await Utilizer.create({
                            username,
                            email,
                            caption,
                            dp: response?.secure_url,
                            password: hash
                        })
                        let personalChat = await Chat.create({
                            admin: [user._id],
                            members: [user._id],
                            chatWith: user._id,
                        })
                        user.chats.unshift(personalChat._id);
                        await user.save();
                        let otp = (Math.floor(Math.random() * 999999)).toString().padEnd(6, 0)
                        user.verifiedToken = otp;
                        await user.save();
                        let emailResult = email.includes('+test') ? true : (await nodeMailerSendingEmails(email, otp, 'signup'));
                        if (emailResult) {
                            return res.json({message: 'Account has been created, but you have to verify your account.', id: user.id, status: 200});
                        } else throw new Error('Something went wrong.')
                    }
                } else throw new Error('Something went wrong.')
            } else {
                return res.json({message: 'Email already exists.', error: {email: 'Email already exists.'}, status: 204});
            }
        } else {
            throw new Error('Post Data is missing.');
        }
    } catch (error) {
        console.log("SIGNUP CONTROLLER ERROR: ", error.message);
        return res.json({message: error.message, status: 404})
    }
}

export default signupController;