import express from 'express'
import dotenv from 'dotenv'
import { mongoDbConnection } from './connection/mongoDb.connection';
import { createServer } from 'http'
import {Server} from 'socket.io'
import { socketConnection } from './connection/socket.connection';
import logger from './utility/logger';
import router from './router';
import  cors from 'cors'
dotenv.config()
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Auth-Token'],
        exposedHeaders: ['X-Auth-Token']
    }
})

app.use(cors())
app.use(express.json());

app.get("/", (req: any, res: any) => {
    console.log("test check api calling ")
    console.log("check token ", req.headers['x-auth-token']);
    res.status(200).send({
        message:"server api call test successfully"
    })
})

app.use("/",router)
httpServer.listen(process.env.SERVER_PORT, async() => {
    await mongoDbConnection();
    await socketConnection();
    logger.info(`server running on PORT ${process.env.SERVER_PORT}`);
})
export default io;