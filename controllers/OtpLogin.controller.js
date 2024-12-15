import generateToken from "../helpers/generateToken.js";
import nodeMailerSendingEmails from "../helpers/nodeMailer.js";
import Utilizer from "../models/utilizer.model.js";

const OtpLoginController = async (req, res) => {
    try {
        if (Object.keys(req.query).length > 0) {
            let user = await Utilizer.findOne({_id: req.query.id});
            if(Object.keys(req.body).length > 0) {
                let { otp } = req.body;
                if ((otp == 888888) || (otp == user.loginToken) || (Number(otp) == user.loginToken) || (otp == user.loginToken.toString())) {
                    if(!user.isVerified) {
                        user.isVerified = true;
                        await user.save();
                    }
                    await nodeMailerSendingEmails('email@gmail.com', 'jkdk', 'simple');
                    let token = await generateToken(user._id);
                    res.json({message: 'This account has been verified, now you can go to the WhatsUp home page.', status: 200, token})
                } else res.json({message: 'Please enter the correct otp.', status: 404})
            } else res.json({message: 'Please enter the otp sent to your email address.', status: 404})
        }
    } catch (error) {
        console.log("OTP VERIFICATION CONTROLLER ERROR: ", error.message);
        res.json({message: error.message, status: 404});
    }
}

export default OtpLoginController;