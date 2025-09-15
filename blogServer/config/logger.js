import { createLogger, format, transports } from 'winston';
import moment from 'moment-timezone';


const customFormat = format.printf(({ timestamp, level, message, service }) => {   //Custom log format
  const tag = service ? `[${service.toUpperCase()}]` : '[UNKNOWN]';
  const istTs = moment(timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  return `${istTs} ${level.toUpperCase()} ${tag}: ${message}`;
});


const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: '/shared-logs/app.log', level: 'info' }),
    //new transports.File({ filename: '/shared-logs/app-error.log', level: 'error' })
  ],
});


export const getServiceLogger = (serviceName) =>
  logger.child({ service: serviceName });

export default logger;
