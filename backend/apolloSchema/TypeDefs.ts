
import {gql} from 'apollo-server-express';

export default gql`
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
        coverPicture: String
        desc: String
        city: String
        from: String
        relationship: Int
    }
    type User{
        name: String!
        email: String!
        profilePicture: String
        coverPicture: String
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
        user: Int!
        desc: String!
        imgs: [String!]!
        likes: [Int!]!
    }


    #Querys
    type Query{
        getUser(userId: Int!): User!
        getPost(postId: Int!): Post!
        getTimelinePosts: [Post!]!
    }

    #Mutations
    type Mutation {
        register(name: String!, password: String!, email: String!): User!
        login(email: String!, password: String!): UserData!
        logout: String!
        refresh: UserData!
        updateUser(userId: Int!, user: InputUser!): User!
        deleteUser(userId: Int!): User!
        followUser(userId: Int!): Boolean!
        unfollowUser(userId: Int!): Boolean!

        createPost(desc: String!, imgs: [String!]!): Post!
        updatePost(postId: Int!, post: InputPost!): Post!
        deletePost(postId: Int!): Post!
        likePost(postId: Int!): Boolean!
    }
`;