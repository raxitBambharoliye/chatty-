import logger from "../utility/logger";

export const eventHandler = (socket:any) => {
    socket.onAny((eventName: String, data: any) => {
        logger.info(`EVENT RECEIVED :: ${eventName} :: ${JSON.stringify(data)} :::::::::::::: `) 
        switch (eventName) {
            case "test":
                logger.info(`testing even received ${JSON.stringify(data)} ` );
                break;
        }
    })
}