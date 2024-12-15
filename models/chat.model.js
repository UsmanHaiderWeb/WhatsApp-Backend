import { model, Schema } from "mongoose";

const chatSchema = new Schema({
    chatName: String,
    isGroupChat: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Utilizer'
    },
    chatWith: {
        type: Schema.Types.ObjectId,
        ref: 'Utilizer'
    },
    admin: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Utilizer'
        }
    ],
    purpose: String,
    dp: String,
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Utilizer'
        }
    ],
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    onlyAdminMessage: {
        type: Boolean,
        default: false
    },
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message'
    },
    isChatBlocked: {
        type: Boolean,
        default: false
    },
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Utilizer'
        }
    ],
    chatBlockedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Utilizer'
    }
}, {timestamps: true})

const Chat = model('Chat', chatSchema);
export default Chat;