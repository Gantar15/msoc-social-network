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
    type UserDto{
        name: String!
        email: String!
        id: Int!
        isActivated: Boolean!
    }
    type UserData{
        refreshToken: String!
        accessToken: String!
        user: UserDto!
    }

    #post
    input InputPost{
        desc: String
        imgs: [String!]
    }
    type Post{
        desc: String
        imgs: [String!]
        videos: [String!]
        likes: [Int!]!
        user: User!
        id: Int!
        dislikes: [Int!]!
        comments: [Int!]
        createdAt: String!
        shareCount: Int!
    }

    #messenge
    type Messenge{
        text: String!
        authorId: Int!
        recipientId: Int!
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
        getMessenges(recipientId: Int!): [Messenge!]!
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

        #POsts
        createPost(desc: String, imgs: [Upload!], videos: [Upload!]): Post!
        updatePost(postId: Int!, post: InputPost!): Post!
        deletePost(postId: Int!): Post!
        likePost(postId: Int!): Boolean!
        dislikePost(postId: Int!): Boolean!

        #Messenges
        sendMessenge(recipientId: Int!, messenge: String!): Messenge!
    }

    #Subscriptions
    type Subscription{
        watchMessenge(recipientId: Int!): Messenge!
    }
`;