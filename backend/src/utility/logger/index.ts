import winston,{ createLogger,transports,format } from "winston";

const transportsArray:any = [
  new winston.transports.Console(),
  new transports.File({
      filename: "./logs/info.log",
      level: "info",
      format: format.combine(
          format.colorize({ all: true }),
          format.timestamp({ format: "YYY-MM-DD HH:MM:ss:SSS" }),
        ),
  })
]

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: "YYY-MM-DD HH:MM:ss:SSS" }),
        format.printf((info) => {
          return `${[info.timestamp]} : ${[info.level]} : ${[info.message]}`;
        })
      ),
    transports: transportsArray
})

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
})

export default logger;