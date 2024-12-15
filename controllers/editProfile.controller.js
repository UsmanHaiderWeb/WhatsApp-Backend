import compareBcryptHashPassword from "../helpers/compareBryptHash.js";
import generateBcryptHash from "../helpers/generateBcryptHash.js";
import uploadOnCloudnary from "../helpers/UploadOnCloudinary.js";
import validator from 'validator'

const editProfileController = async (req, res) => {
    try {
        if (req.MoveOnStatus) {
            if(Object.keys(req.body).length > 0){
                let { oldPassword, updatedValue, updateWhichOne} = req.body;
                console.log("req.body: ", req.body);
                let user = req.user;
                console.log("REQ.USER: ", req.user);
                let passwordCheckResult = await compareBcryptHashPassword(oldPassword, user.password);
                if(passwordCheckResult) {
                    if (updateWhichOne == 'password') {
                        if(validator.isStrongPassword(updatedValue)){
                            let hash = await generateBcryptHash(updatedValue);
                            user.password = hash;
                        } else return res.json({error: {updatedValue: 'Enter a strong password.'}, status: 404})
                    } else if (updateWhichOne == 'email') {
                        if(validator.isEmail(updatedValue)){
                            user.email = updatedValue;
                        } else return res.json({error: {updatedValue: 'Email is not valid'}, status: 404})
                    } else if (updateWhichOne == 'caption') {
                        console.log("updatedValue: ", updatedValue);
                        user.caption = updatedValue;
                    } else if (updateWhichOne == 'dp') {
                        let response = await uploadOnCloudnary(req?.file?.buffer);
                        if (response?.secure_url) {
                            user.dp = response?.secure_url;
                        } else return res.json({message: 'Something went wrong.', status: 404})
                    } else if (updateWhichOne == 'username') {
                        try {
                            user.username = updatedValue;
                            await user.save();
                        } catch (error) {
                            console.log("UPDATING USERNAME ERROR: ", error.message);
                            res.json({error: {updatedValue: 'Username already exists.'}, status: 404})
                            return;
                        }
                    }
                    await user.save();
                    res.json({message: "Profile data has been updated.", user, status: 200})
                } else res.json({error: {oldPassword: 'Please enter correct password.'}, status: 404})
            } else res.json({message: 'Data is missing', status: 404})
        } else res.json({message: 'Please make sure that you are logged in.', status: 404})
    } catch (error) {
        console.log("editProfileController ERROR: ", error.message);
        res.json({message: 'Something went wrong.', status: 404})
    }
}

export default editProfileController;