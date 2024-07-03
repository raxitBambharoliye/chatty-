import io from ".."
import { eventHandler } from "../eventHandlers";
import logger from "../utility/logger";

export const socketConnection = async ()=>{
    io.on('connection', (socket) => {
        logger.info('Client connected', socket.id);
        eventHandler(socket);

    })
}