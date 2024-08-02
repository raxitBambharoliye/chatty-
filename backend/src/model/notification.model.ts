import mongoose, { Schema } from "mongoose";
import { MODEL } from "../constant";


const notificationSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['FOLLOW_REQUEST', 'FOLLOW_ACCEPTED', 'MESSAGE'],
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: MODEL.USER_MODEL,
            required:true
        },
        view: {
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true
    }
)

 const NotificationModal = mongoose.model(MODEL.NOTIFICATION_MODEL, notificationSchema);
export default NotificationModal;
