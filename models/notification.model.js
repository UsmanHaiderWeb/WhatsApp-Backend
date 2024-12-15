import { model, Schema } from "mongoose";

const notifySchema = new Schema({
    content: String,
    chatID: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    isNotifiedMessage: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Notification = model('Notification', notifySchema);
export default Notification;