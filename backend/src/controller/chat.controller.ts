import { EVENT_NAME, MQ } from "../common";
import { MODEL } from "../constant";
import { sendToSocket } from "../eventHandlers";
import { UserIN } from "../utility/interfaces";
import logger from "../utility/logger"

export const followRequest = async (socket: any, data:any)=>{
    try {
        console.log('data', data)
        const sender = await MQ.findById<UserIN>(MODEL.USER_MODEL, data.senderId);
        console.log('sender', sender)
        if (!sender) {
            return false;
        }
        const receiver = await MQ.findById<UserIN>(MODEL.USER_MODEL, data.receiverId);
        console.log('receiver', receiver)
        if (!receiver) { 
            return false;
        }

        const updateSender = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, sender.id, { $push: { sendedRequest: receiver.id } },true);   
        const updateReceiver = await MQ.findByIdAndUpdate<UserIN>(MODEL.USER_MODEL, receiver.id, { $push: { friendRequest: sender.id } },true);
        if (!updateSender || !updateReceiver) {
            return;
        }
        let sendData:any = {
            eventName: EVENT_NAME.FOLLOW,
            data: {
                user:updateSender,
            }
        }
        sendToSocket(socket, sendData);
    } catch (error) {
        logger.error(`CATCH ERROR IN :: followRequest ${error}`);
        console.log('error', error)
    }
}