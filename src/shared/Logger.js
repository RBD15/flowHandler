const { default: pino } = require('pino')

//#region Pino log levels
// logger.fatal('fatal');
// 50 logger.error('error');
// 40 logger.warn('warn');
// 30 logger.info('info');
// 20 logger.debug('debug');
// 10 logger.trace('trace');
//#endregion

// const createLogTransport = (pinoInstance,logFileDir,logFileName,level)=>{
//   const transport = pinoInstance.transport({
//     level: level,
//     target: 'pino-pretty',
//     options: {
//       destination: logFileDir+logFileName,
//       mkdir: true,
//       translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
//     },
//     timestamp: pino.stdTimeFunctions.epochTime
//   })
// }
// let logFileDir = __dirname+'/../logs/'

const backendTransport = pino.transport({
  level: 'debug',
  target: 'pino-pretty',
  // target: 'pino/file',
  options: {
    destination: __dirname+'/../logs/backend.log',
    mkdir: true,
    colorize: false,
    messageKey: 'msg',
    translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
    ignore: 'pid,hostname',
  },
  timestamp: pino.stdTimeFunctions.epochTime
})

const socketTransport = pino.transport({
  level: 'debug',
  target: 'pino-pretty',
  // target: 'pino/file',
  options: {
    destination: __dirname+'/../logs/socket.log',
    mkdir: true,
    colorize: false,
    messageKey: 'msg',
    translateTimestamp: "SYS:h:MM:ss TT Z o",
    ignore: 'pid,hostname',
  },
  timestamp: pino.stdTimeFunctions.epochTime,
})

const systemTransport = pino.transport({
  level: 'debug',
  target: 'pino-pretty',
  // target: 'pino/file',
  options: {
    destination: __dirname+'/../logs/system.log',
    mkdir: true,
    colorize: false,
    messageKey: 'msg',
    ignore: 'pid,hostname',
  },
  timestamp: pino.stdTimeFunctions.epochTime,
})

const backendLog = pino(backendTransport)
const socketLog = pino(socketTransport)
const systemLog = pino(systemTransport)

module.exports = {
  backendLog,
  socketLog,
  systemLog
}


