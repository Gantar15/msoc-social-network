
import {gql} from 'apollo-server-express';

export default gql`
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

    #Querys
    type Query{
        getUser(id: String!): String!
    }

    #Mutations
    type Mutation {
        register(name: String!, password: String!, email: String!): User!
        login(email: String!, password: String!): UserData!
        logout: String!
        refresh: UserData!
        updateUser(userId: Int!, user: InputUser!): User!
        deleteUser(userId: Int!): User!
        getUser(userId: Int!): User!
        followUser(userId: Int!): Boolean!
        unfollowUser(userId: Int!): Boolean!
    }
`;