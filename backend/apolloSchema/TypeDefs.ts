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


    #Querys
    type Query{
        getUser(userId: Int!): User!
        getPost(postId: Int!): Post!
        getTimelinePosts: [Post!]!
    }

    #Mutations
    type Mutation {
        register(name: String!, password: String!, repeatPassword: String!, email: String!): User!
        login(email: String!, password: String!): UserData!
        logout: String!
        refresh: UserData!
        updateUser(userId: Int!, user: InputUser!): User!
        deleteUser(userId: Int!): User!
        followUser(userId: Int!): Boolean!
        unfollowUser(userId: Int!): Boolean!

        createPost(desc: String, imgs: [Upload!], videos: [Upload!]): Post!
        updatePost(postId: Int!, post: InputPost!): Post!
        deletePost(postId: Int!): Post!
        likePost(postId: Int!): Boolean!
    }
`;