import { model, Schema } from "mongoose";

const utilizerSchema = new Schema({
    username: {
        required: true,
        unique: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    caption: String,
    password: {
        required: true,
        type: String
    },
    dp: String,
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Utilizer'
        }
    ],
    chats: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ],
    allMessages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    notifications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    theme: {
        type: Boolean,
        default: true
    },
    blockedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Utilizer'
        }
    ],
    blockedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Utilizer'
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedToken: {
        type: String,
    },
    forgotPasswordToken: {
        type: String,
    },
    loginToken: {
        type: String,
    }
}, {timestamps: true})

const Utilizer = model('Utilizer', utilizerSchema);
export default Utilizer;