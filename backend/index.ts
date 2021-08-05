
import express from "express";
import {ApolloServer} from 'apollo-server-express';
require("dotenv").config();
import sequelize from './db';
import typeDefs from "./apolloSchema/TypeDefs";
import resolvers from "./apolloSchema/Resolvers";


const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers
});

async function startServer(){
    sequelize.sync();

    await server.start();
    server.applyMiddleware({app});

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
}

startServer();