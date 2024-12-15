import Utilizer from "../models/utilizer.model.js";
import verifyJwtToken from '../helpers/verifyJwtToken.js'

const authenticate = async (req, res, next) => {
    try {
        if (Object.keys(req.query).length > 0) {
            let id = await verifyJwtToken(req.query.token);
            if (id) {
                let user = await Utilizer.findOne({_id: id});
                if (user) {
                    if(user.isVerified){
                        req.MoveOnStatus = true;
                        req.user = user;
                    } else req.MoveOnStatus = false
                } else req.MoveOnStatus = false
            } else req.MoveOnStatus = false
        } else req.MoveOnStatus = false
    } catch (error) {
        console.log("AUTHENTICATING MIDDLEWARE ERROR: ", error.message);
        req.MoveOnStatus = false;
    }
    next();
}

export default authenticate;