let typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        caption: String,
        dp: String,
        friends: [User]
        chats: [Chat]
        theme: Boolean,
        blockedUsers: [User]
        notifications: [Notification]
        isVerified: Boolean
    }
    type Chat {
        _id: ID
        chatName: String
        isGroupChat: Boolean
        creator: User
        chatWith: User
        admin: [User]
        dp: String
        purpose: String
        members: [User]
        messages: [Message]
        onlyAdminMessage: Boolean
        isChatBlocked: Boolean
        chatBlockedBy: User
        latestMessage: Message
        requests: [User]
    }
    type Message {
        _id: ID
        sentBy: User
        content: String
        isRelatedToAnyGroup: Boolean
        chatID: Chat
        isNotifiedMessage: Boolean
        createdAt: String
    }
    type Notification {
        _id: ID
        content: String
        chatID: Chat
        isNotifiedMessage: Boolean
    }
    type Query {
        getUsers: [User]
        getSingleUser(id: ID!, isToken: Boolean): User
        isChatExist(id: ID!): Chat
        getAllGroups: [Chat]
    }
    type Mutation{
        sendRequestToGroup(token: String!, id: ID!): Chat
    }
`

export default typeDefs;