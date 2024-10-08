import mongoose, { Schema, model, mongo } from "mongoose";
import { MODEL } from "../constant";


const userSchema = new Schema({
    userName: {
        type: String,
        required:true,
    },
    DOB : {
        type: String,
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
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    password: {
        type: String,
    },
    isOnLine: {
        type: Boolean,
        default: false,
        required: true,
    },
    withEmail: {
        type: Boolean,
        default: false,
        required: true,
    },
    friendRequest: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        default: [],
        ref:MODEL.USER_MODEL,
        required: true,
    },
    sendedRequest: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: MODEL.USER_MODEL }],
        default: [],
        ref:MODEL.USER_MODEL,
        required:true,
    },
    socketId: {
        type: String,
        default: null,
    },
    friends: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    groups: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.GROUP_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    blockedByUsers: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    pinedUsers: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    mutedUser: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    messageOrder: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    unFollowedUser: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    unFollowedByUsers: {
        type: [{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        default: [],
        required: true,
    },
    verifiedEmail: { type: Boolean, default: false },
    profilePictureId: { type: String, }
}, { timestamps: true })

const USER = mongoose.model(MODEL.USER_MODEL, userSchema);
export default USER;