import mongoose, { Schema } from "mongoose";
import { MODEL } from "../constant";

const messageSchema= new Schema({
    message:{
        type:String,
        required:true,
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:MODEL.USER_MODEL,
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:MODEL.USER_MODEL,
        required:true,
    },
},{timestamps:true})


const MessageModel=mongoose.model(MODEL.MESSAGE_MODEL,messageSchema);

export default MessageModel;