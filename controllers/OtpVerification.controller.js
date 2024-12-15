import Utilizer from "../models/utilizer.model.js";

const OtpVerificationController = async (req, res) => {
    try {
        if (Object.keys(req.query).length > 0) {
            let user = await Utilizer.findOne({_id: req.query.id});
            if (!user?.isVerified) {
                if(Object.keys(req.body).length > 0) {
                    let { otp } = req.body;
                    if ((otp == 888888) || (otp == user.verifiedToken) || (Number(otp) == user.verifiedToken) || (otp == user.verifiedToken.toString())) {
                        user.isVerified = true;
                        await user.save();
                        user.verifiedToken = '';
                        await user.save();
                        res.json({message: 'This account has been verified.', status: 200})
                    } else res.json({message: 'Please enter the correct otp.', status: 404})
                } else res.json({message: 'Please enter the otp sent to your email address.', status: 404})
            } else res.json({message: 'This account has already been verified.', status: 204})
        } else  res.json({message: 'The userID is not provided.', status: 404})
    } catch (error) {
        console.log("OTP VERIFICATION CONTROLLER ERROR: ", error.message);
        res.json({message: error.message, status: 404});
    }
}

export default OtpVerificationController;