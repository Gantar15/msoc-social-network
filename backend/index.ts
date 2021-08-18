
import express, { Request, Response } from "express";
import {ApolloServer} from 'apollo-server-express';
import cors from 'cors';
import helmet from "helmet";
const cookieParser = require('cookie-parser');
require("dotenv").config();
import sequelize from './db';
import typeDefs from "./apolloSchema/TypeDefs";
import resolvers from "./apolloSchema/Resolvers";
import authMiddleware from "./middlewares/auth-middleware";
import authRoute from './routes/authRoute';


const app = express();

app.use(express.static('files'));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
// app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(authMiddleware);

app.use('/auth/', authRoute);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req, res}: {req: Request, res: Response}) => {
        return {
            req,
            resp: res
        };
    }
});

async function startServer(){
    await sequelize.sync();
    
    await server.start();
    server.applyMiddleware({app, cors:{origin: process.env.CLIENT_URL}});

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
}

startServer();