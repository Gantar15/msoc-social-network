
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";
const {GraphQLUpload} = require('graphql-upload');

export default {
    Upload: GraphQLUpload,
    Query,
    Mutation,
    Subscription
};