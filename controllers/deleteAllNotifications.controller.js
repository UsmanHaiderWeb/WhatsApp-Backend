import Notification from '../models/notification.model.js';
import Utilizer from '../models/utilizer.model.js';

const deleteAllNotificationController = async (req, res) => {
    try {
        if (!req.MoveOnStatus) return res.json({ message: 'You need to login first.', status: 404 });
        
        const { notifications } = req.body;
        if (notifications?.length == 0) return res.json({ message: 'No notification is received.', status: 404 });

        // Delete notifications in a single operation
        const deleteResult = await Notification.deleteMany({ _id: { $in: notifications }, isNotifiedMessage: true });

        // Check if any notifications were deleted
        if (deleteResult.deletedCount > 0) {
            // Update user's notifications array
            req.user.notifications = req.user.notifications.filter(notify => !notifications.includes(notify._id.toString()));
            await req.user.save();
            return res.json({ message: 'All notifications have been deleted.', notifications: req.user.notifications, status: 200 });
        } else {
            return res.json({ message: 'No notifications to delete.', notifications: req.user.notifications, status: 200 });
        }
    } catch (error) {
        console.log("deleteAllNotificationController ERROR: ", error.message);
        res.json({ message: 'Something went wrong.', status: 500 });
    }
}

export default deleteAllNotificationController;
