import Utilizer from "../models/utilizer.model.js";

const isLoggedInController = async (req, res) => {
    try {
        if (req.MoveOnStatus) {
            let user = await Utilizer.findOne({_id: req.user._id}).select('-password');
            res.json({message: 'This is a valid user.', status: 200, isvalidUser: true, user});
        } else res.json({message: 'User does not exist.', status: 404, isvalidUser: false})
    } catch (error) {
        console.log("isLoggedInController ERROR: ", error.message);
    }
}

export default isLoggedInController;