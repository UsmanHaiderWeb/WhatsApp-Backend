import compareBcryptHashPassword from "../helpers/compareBryptHash.js";
import nodeMailerSendingEmails from "../helpers/nodeMailer.js";
import Utilizer from "../models/utilizer.model.js";


const loginController = async (req, res) => {
    try {
        if (Object.keys(req.body).length > 0) {
            let { email, password } = req.body
            let user = await Utilizer.findOne({email});
            if(user){
                let result = await compareBcryptHashPassword(password, user.password);
                if (result) {
                    let otp = (Math.floor(Math.random() * 999999)).toString().padEnd(6, 0)
                    user.loginToken = otp;
                    await user.save();
                    let emailResult = email.includes('+test') ? true : await nodeMailerSendingEmails(email, otp, 'login');
                    if (emailResult) {
                        res.json({message: 'User has been logged in successfully. But you have to verify that it is you by entring the OTP.', id: user?._id, status: 200});
                    } else throw new Error('Something went wrong.')
                } else {
                    res.json({message: 'Password is incorrect.', error: {password: 'Password is incorrect.'}, status: 404});
                }
            } else {
                res.json({message: 'Email does not exist.', error: {email: 'Email does not exist.'}, status: 404});
            }
        } else {
            throw new Error('Post Data is missing.');
        }
    } catch (error) {
        console.log("LOGIN CONTROLLER ERROR: ", error.message);
        res.json({message: error.message, status: 404})
    }
}

export default loginController;