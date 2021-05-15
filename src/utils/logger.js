// https://www.npmjs.com/package/pino-http
// https://github.com/pinojs/pino-http/blob/master/README.md#example
import pino from 'pino';
import pkg from 'pino-http';

// const logger = pino({
//   level: process.env.LOG_LEVEL || 'info',
//   prettyPrint: { colorize: true },
//   //
const loggerConfig = pkg({
  // Reuse an existing logger instance
  logger: pino({
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: { colorize: true },
    //
  }),

  autoLogging: process.env.SHOW_REQ_RES !== 'false',

  // Define a custom request id function
  genReqId(req) {
    return req.id;
  },

  // Define custom serializers for request, response and error
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  //   serializers: {
  // res: pino.stdSerializers.res,
  // req(req) {
  //   req.body = req.raw.body;
  //   return req.body;
  // },
  // req(req) {
  //   return {
  //     message: req.foo,
  //   };
  // },
  //   },

  // Set to `false` to prevent standard serializers from being wrapped.
  wrapSerializers: true,

  // Logger level is `info` by default
  //   useLevel: 'info',

  // Define a custom logger level
  customLogLevel(res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },

  // Define a custom success message
  customSuccessMessage(res) {
    if (res.statusCode === 404) {
      return 'resource not found';
    }
    return 'request completed';
  },

  // Define a custom error message
  customErrorMessage(error, res) {
    return `request errored with status code: ${res.statusCode}`;
  },
  // Override attribute keys for the log object
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'timeTaken',
  },

  // Define additional custom request properties
  customProps(req, res) {
    return {
      customProp: req.customProp,
      // user request-scoped data is in res.locals for express applications
      customProp2: res.locals.myCustomData,
    };
  },
});

const { logger } = loggerConfig;
logger.info('Configured logger');
export default logger;
export { loggerConfig };
