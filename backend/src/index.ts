import express from 'express'
import dotenv from 'dotenv'
import { mongoDbConnection } from './connection/mongoDb.connection';
import { createServer } from 'http'
import {Server} from 'socket.io'
import { socketConnection } from './connection/socket.connection';
import logger from './utility/logger';
import router from './router';
dotenv.config()
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.json());


app.use("/",router)
httpServer.listen(process.env.SERVER_PORT, async() => {
    await mongoDbConnection();
    await socketConnection();
    logger.info(`server running on PORT ${process.env.SERVER_PORT}`);
})
export default io;