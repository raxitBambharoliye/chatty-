// process.env.UV_THREADPOOL_SIZE = "128"
import express from "express";
import dotenv from "dotenv";
import { mongoDbConnection } from "./connection/mongoDb.connection";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketConnection } from "./connection/socket.connection";
import logger from "./utility/logger";
import router from "./router";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import "./config/passport";
import { googleRouter } from "./router/google.router";
import Cookies from "cookie-parser";
import { MessageModel } from "./model";
import { getMessages } from "./controller/user.controller";
import path from 'path';  
process.env.UV_THREADPOOL_SIZE = "128"
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-Auth-Token",
    ],
    exposedHeaders: ["X-Auth-Token"],
  },
});

app.use(cors());
app.use(express.json());
app.use(Cookies());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cookieSession({
    name: "google",
    keys: ["chattyPie"],
    maxAge: 24 * 60 * 60,
  })
);
// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb: any) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb: any) => {
      cb();
    };
  }
  next();
});
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req: any, res: any) => {
//   const senderId = "669de4006bda9f696cc6aae7";
//   const receiverId ="66a66b8d31b9fcf4e9c40d6f"
//   const date =await MessageModel.aggregate([
//     // Match messages by senderId and receiverId
//     { $match: { senderId, receiverId } },
//     // Group by date (without time)
//     {
//         $group: {
//             _id: {
//                 year: { $year: "$createdAt" },
//                 month: { $month: "$createdAt" },
//                 day: { $dayOfMonth: "$createdAt" }
//             },
//             messages: { $push: "$$ROOT" }
//         }
//     },
//     // Sort by date
//     { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
// ]);

  /* 
  
  
   await Message.aggregate([
            // Match messages by senderId and receiverId
            { $match: { senderId, receiverId } },
            // Group by date (without time)
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    },
                    messages: { $push: "$$ROOT" }
                }
            },
            // Sort by date
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
  */
  // console.log('date', JSON.stringify(date))
  res.status(200).send({message: "server api call test successfully"});
});
app.post("/",getMessages)
app.use("/", router);
app.use("/auth", googleRouter);


// const localtunnel = require("localtunnel");

httpServer.listen(process.env.SERVER_PORT, async () => {
  await mongoDbConnection();
  await socketConnection();
  // let tunnel= await localtunnel(8080,{subdomain:"chatty-pie-host"})
  // tunnel.url;
  // console.log('tunnel.url', tunnel.url)
  logger.info(`server running on PORT ${process.env.SERVER_PORT}`);
});
export { io };
