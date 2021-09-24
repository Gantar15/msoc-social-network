
import express, { Request, Response } from "express";
import {ApolloServer} from 'apollo-server-express';
import {graphqlUploadExpress} from 'graphql-upload';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import helmet from "helmet";
const cookieParser = require('cookie-parser');
require("dotenv").config();
import sequelize from './db';
import typeDefs from "./apolloSchema/TypeDefs";
import resolvers from "./apolloSchema/Resolvers";
import authMiddleware from "./middlewares/auth-middleware";
import authRoute from './routes/authRoute';
import tokenService from "./services/tokenService";
import User from "./models/User";


const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  }));
app.use(express.static('files'));
// app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(authMiddleware);
app.use(graphqlUploadExpress());

app.use('/auth/', authRoute);

const httpServer = createServer(app);
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const apolloServer = new ApolloServer({
    schema,
    context: async ({req, res}: {req: Request, res: Response}) => {
        return {
            req,
            resp: res
        };
    },
    plugins: [{
        //@ts-ignore
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
    }]
});
const subscriptionServer = SubscriptionServer.create({
    schema,
    subscribe,
    execute,
    async onConnect(connectionParams: any) {
        const accessToken = connectionParams.authorization.split(' ')[1];
        const authUserDto = tokenService.validateAccessToken(accessToken);
        const authUser = User.findByPk(authUserDto?.id);

        return {
            authUser
        }
    }
}, {
    server: httpServer,
    path: apolloServer.graphqlPath
});

async function startServer(){
    await sequelize.sync();
    
    await apolloServer.start();
    apolloServer.applyMiddleware({app, cors:{origin: process.env.CLIENT_URL}});

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
}

startServer();