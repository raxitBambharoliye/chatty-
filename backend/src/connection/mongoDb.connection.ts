import mongoose from "mongoose";
import logger from "../utility/logger";



export const mongoDbConnection = async () => {
    try {
        const dbUrl = process.env.MONGO_URL || "";
        if (!dbUrl) throw new Error("db url is not defined")
        mongoose.set('strictPopulate', false);
        mongoose.connect(dbUrl);
        const db = mongoose.connection;
        db.once("open", () => logger.info("MongoDB Connected"));
        db.on("error", (error) => {
            console.error(`MongoDb Connection Error ::: `, error);
            throw new Error("MongoDb Connection Error ")
        });
    } catch (error) {
        logger.error(`CATCH ERROR IN :: mongoDbConnection::: `,error)
    }
}