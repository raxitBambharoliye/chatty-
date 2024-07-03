import mongoose, { Schema, model, mongo } from "mongoose";
import { MODEL } from "../constant";


const userSchema = new Schema({
    userName: {
        type: String,
        required:true,
    },
    DOB : {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
    },
    tagLine:{
        type: String,
    },
    profilePicture: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: true,
    },
    blockedUserId: {
        type: Array,
        default: [],
    },
    password: {
        type: String,
        required:true,
    },
    isOnLine: {
        type: Boolean,
        default: false,
        required: true,
    }
}, { timestamps: true })

const USER = mongoose.model(MODEL.USER_MODEL, userSchema);
export default USER;