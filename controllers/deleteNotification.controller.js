import Notification from '../models/notification.model.js'

const deleteNotificationController = async (req, res) => {
    try {
        if(!req.MoveOnStatus) return res.json({message: 'You need to login first.', status: 404});
        if(Object.keys(req.query).length == 0) return res.json({message: 'Please select a valid notification.', status: 404});
        let notification = await Notification.findOneAndDelete({_id: req.query.id});
        return res.json({message: 'This notification has been deleted.', deletedNotification: notification, status: 200})
    } catch (error) {
        console.log("deleteNotificationController ERROR: ", error.message);
        res.json({message: 'Something went wrong.', status: 404});
    }
}

export default deleteNotificationController