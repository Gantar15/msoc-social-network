
import express, { NextFunction } from "express";
import {ApolloServer} from 'apollo-server-express';
import cors from 'cors';
import helmet from "helmet";
const cookieParser = require('cookie-parser');
require("dotenv").config();
import sequelize from './db';
import typeDefs from "./apolloSchema/TypeDefs";
import resolvers from "./apolloSchema/Resolvers";
import ApiError from "./lib/ApiError";
import errorMiddleware from "./middleware/errorMiddleware";
import userRoute from './routes/userRoute';
import authRoute from "./routes/authRoute";


const app = express();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use('/user', userRoute);
app.use('/auth', authRoute);

//404 error handler
app.use((_:any, __:any, next: NextFunction)=>{next(ApiError.notFound())});

//Error handling
app.use(errorMiddleware);


const server = new ApolloServer({
    typeDefs,
    resolvers
});

async function startServer(){
    await sequelize.sync();
    
    await server.start();
    server.applyMiddleware({app});

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
}

startServer();