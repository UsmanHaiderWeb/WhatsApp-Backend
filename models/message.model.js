import { model, Schema } from "mongoose";

const messageSchema = new Schema({
    sentBy: {
        type: Schema.Types.ObjectId,
        ref: 'Utilizer'
    },
    content: String,
    isRelatedToAnyGroup: {
        type: Boolean,
        default: false
    },
    chatID: {
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    },
    isNotifiedMessage: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const Message = model('Message', messageSchema);
export default Message;