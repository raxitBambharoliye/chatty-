import express from 'express'
import dotenv from 'dotenv'
import { mongoDbConnection } from './connection/mongoDb.connection';
import { createServer } from 'http'
import {Server} from 'socket.io'
import { socketConnection } from './connection/socket.connection';
import logger from './utility/logger';
import router from './router';
import cors from 'cors'
import cookieSession from 'cookie-session';
import passport from 'passport'
import './config/passport'
import { googleRouter } from './router/google.router';
import Cookies from 'cookie-parser'
import { uploadFile } from './services/googleDrive.service';
import { sendToSocket } from './eventHandlers';
import { EVENT_NAME } from './common';
const localtunnel = require('localtunnel')

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
app.use(Cookies());
app.use(
    cookieSession({
        name: "google",
        keys: ["chattyPie"],
        maxAge:24*60*60
    })
)
// register regenerate & save after the cookieSession middleware initialization
app.use(function(request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb:any) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb:any) => {
            cb()
        }
    }
    next()
})
app.use(passport.initialize())
app.use(passport.session())

app.get("/", async (req: any, res: any) => {
    res.status(200).send({
        message:"server api call test successfully"
    })
})
app.use("/", router)
app.use('/auth',googleRouter)

httpServer.listen(process.env.SERVER_PORT, async() => {
    await mongoDbConnection();
    await socketConnection();
    // let tunnel= await localtunnel(8080,{subdomain:"chatty-pie-host"})
    // tunnel.url;
    // console.log('tunnel.url', tunnel.url)
    logger.info(`server running on PORT ${process.env.SERVER_PORT}`);
})
export  {io};