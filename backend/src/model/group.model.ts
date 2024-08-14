import mongoose from "mongoose";
import { MODEL } from "../constant";


const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    tagLine:{
        type: String,
    },
    groupMembers: {
        type:[{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        required:true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: MODEL.USER_MODEL,
        required: true
    },
    admin: {
        type:[{type:mongoose.Schema.Types.ObjectId,ref:MODEL.USER_MODEL}],
        ref:MODEL.USER_MODEL,
        required:true
    },
    groupProfile: {
        type: String,
    },
    type: {
        type: String,
        default: "GROUP"
        
    }
}, {
    timestamps:true
})

const GroupModel = mongoose.model(MODEL.GROUP_MODEL, groupSchema); 

export default GroupModel;
