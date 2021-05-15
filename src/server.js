import amqp from 'amqplib';
import logger from './utils/logger.js';
import config from './config/config.js';
import ServiceUser from './api/services/serviceUser.js';

const { MQ_HOST, MQ_QUEUE_USER } = config;
class Server {
  async receiveWorkUser() {
    logger.info('Sendo to MQ, for create user.');
    let connection;
    let channel;
    try {
      connection = await amqp.connect(`amqp://${MQ_HOST}`);
      channel = await connection.createChannel();

      channel.assertQueue(MQ_QUEUE_USER, {
        durable: true,
      });
      channel.prefetch(1);
      logger.info(' [*] Waiting for messages in %s. ', MQ_QUEUE_USER);

      const processMessage = async (message) => {
        try {
          logger.info(' [x] Received %s', message.content.toString());
          const userObj = JSON.parse(message.content.toString());
          const serviceUser = new ServiceUser();
          const result = await serviceUser.createUser(userObj);
          logger.info(result, 'Result service');

          channel.ack(message);
        } catch (error) {
          // handle errors
        }
      };

      channel.consume(MQ_QUEUE_USER, processMessage, {
        // manual acknowledgment mode,
        // see https://www.rabbitmq.com/confirms.html for details
        noAck: false,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  handleError(error) {
    logger.error(error);
  }
}

const server = new Server();
server.receiveWorkUser();
