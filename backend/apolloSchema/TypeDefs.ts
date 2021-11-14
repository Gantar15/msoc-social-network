import {gql} from 'apollo-server-express';

export default gql`

    scalar Upload

    #user
    enum Role{
        user
        admin
        moderator
    }
    input InputUser{
        name: String
        email: String
        password: String
        profilePicture: String
        desc: String
        city: String
        from: String
        relationship: Int
    }
    type User{
        name: String!
        email: String!
        profilePicture: String
        followers: [String]
        followins: [String]
        role: Role
        id: Int
        isActivated: Boolean
        desc: String
        city: String
        from: String
        relationship: Int
    }
    type UserData{
        refreshToken: String!
        accessToken: String!
        user: User!
    }

    #post
    input InputPost{
        desc: String
        imgs: [String!]
        videos: [String!]
        audios: [String!]
    }
    type Post{
        desc: String
        imgs: [String!]
        videos: [String!]
        audios: [String!]
        likes: [Int!]!
        user: User!
        id: Int!
        dislikes: [Int!]!
        comments: [Int!]
        createdAt: String!
        shareCount: Int!
    }

    #messenge
    type AccordFile{
        filename: String!
        codedFilename: String!
    }
    type Messenge{
        id: Int!
        createdAt: String!
        updatedAt: String!
        text: String!
        authorId: Int!
        recipientId: Int!
        imgs: [String!]
        videos: [String!]
        documents: [AccordFile!]
        audios: [String!]
    }
    type Interlocutor{
        id: Int!
        name: String!
        profilePicture: String!
    }
    enum OperationType{
        MESSENGE_SEND
        MESSENGE_EDIT
        MESSENGE_REMOVE
    }
    type watchMessengeOut{
        messenge: Messenge!
        operationType: OperationType!
    }

    #video char
    enum RTCSdpType{
        answer
        offer
        pranswer
        rollback
    }
    type SessionDescriptionInit{
        sdp: String
        type: RTCSdpType!
    }
    input SessionDescriptionInitInput{
        sdp: String
        type: RTCSdpType!
    }
    type IceCandidateInit{
        candidate: String
        sdpMLineIndex: Int
        sdpMid: String
        usernameFragment: String
    }
    input IceCandidateInitInput{
        candidate: String
        sdpMLineIndex: Int
        sdpMid: String
        usernameFragment: String
    }
    type AddPeerOut{
        createOffer: Boolean!
        peerId: Int!
    }
    type RemovePeerOut{
        peerId: Int!
    }
    type SessionDescriptionOut{
        peerId: Int!
        sessionDescription: SessionDescriptionInit!
    }
    type IceCandidateOut{
        peerId: Int!
        iceCandidate: IceCandidateInit!
    }


    #Querys
    type Query{
        #Post
        getPost(postId: Int!): Post!
        getUserPosts(userId: Int!, limit: Int!, offset: Int!): [Post!]!
        getUserPostsCount(userId: Int!): Int!
        getTimelinePosts(limit: Int!, offset: Int!, refreshToken: String): [Post!]!
        getTimelinePostsCount: Int!

        #User
        getUser(userId: Int!): User!
        getFollowers(userId: Int!, limit: Int!, offset: Int!): [User!]!
        getFollowins(userId: Int!, limit: Int!, offset: Int!): [User!]!
        getFollowersCount(userId: Int!): Int!
        getFollowinsCount(userId: Int!): Int!

        #Messenges
        getMessenges(recipientId: Int!, refreshToken: String): [Messenge!]!
        getNewestInterlocutors: [Interlocutor!]!
        getNewestMessenges: [Messenge!]!
    }

    #Mutations
    type Mutation{
        #User
        register(name: String!, password: String!, repeatPassword: String!, email: String!): User!
        login(email: String!, password: String!, isSession: Boolean!): UserData!
        logout: String!
        refresh: UserData!
        updateUser(userId: Int!, user: InputUser!): User!
        deleteUser(userId: Int!): User!
        followUser(userId: Int!): User!
        unfollowUser(userId: Int!): User!

        #Posts
        createPost(desc: String, imgs: [Upload!], videos: [Upload!], audios: [Upload!]): Post!
        updatePost(postId: Int!, post: InputPost!): Post!
        deletePost(postId: Int!): Post!
        likePost(postId: Int!): Boolean!
        dislikePost(postId: Int!): Boolean!

        #Messenges
        sendMessenge(recipientId: Int!, messenge: String, imgs: [Upload!], videos: [Upload!], documents: [Upload!], audios: [Upload!]): Messenge!
        removeMessenge(messengeId: Int!, clientInvisibility: Boolean!): Messenge!
        editMessenge(messengeId: Int!, messenge: String, imgs: [Upload!], videos: [Upload!], documents: [Upload!], audios: [Upload!]): Messenge!

        #Video chat
        joinVideoRoom(roomId: Int!): Boolean!
        leaveVideoRoom: Boolean!
        relayICE(targetPeer: Int!, iceCandidate: IceCandidateInitInput!): Boolean!
        relaySDP(targetPeer: Int!, sessionDescription: SessionDescriptionInitInput!): Boolean!
    }

    #Subscriptions
    type Subscription{
        watchMessenge: watchMessengeOut!

        #Video chat
        addVideoPeer: AddPeerOut!
        removeVideoPeer: RemovePeerOut!
        sessionDescription: SessionDescriptionOut!
        iceCandidate: IceCandidateOut!
    }
`;