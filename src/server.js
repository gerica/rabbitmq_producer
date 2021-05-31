import amqp from 'amqplib';
import logger from './utils/logger.js';
import config from './config/config.js';
import MessageService from './api/services/messageService.js';

const {
  MQ_HOST,
  MQ_USER,
  MQ_PASSQWORD,
  MQ_QUEUE_WORK_MSG,
  MQ_QUEUE_WORK_MSG_RESPONSE,
  //
} = config;
const messageService = new MessageService();
class Server {
  async receiveWorkMsg() {
    logger.info('Server:receiveWorkMsg');
    try {
      const { channel } = await this.createConnection();

      channel.assertQueue(MQ_QUEUE_WORK_MSG, {
        durable: true,
      });
      channel.prefetch(1);
      logger.info(' [*] Waiting for messages in %s. ', MQ_QUEUE_WORK_MSG);

      const processMessage = async (message) => {
        try {
          logger.info(' [x] Received %s', message.content.toString());
          const msgObj = JSON.parse(message.content.toString());
          const result = messageService.setMessage(msgObj);
          this.receiveWorkMsgResponse(result);
          logger.info('Server:receiveWorkMsg:Success');
          channel.ack(message);
        } catch (error) {
          this.handleError(error);
        }
      };

      channel.consume(MQ_QUEUE_WORK_MSG, processMessage, {
        // manual acknowledgment mode,
        // see https://www.rabbitmq.com/confirms.html for details
        noAck: false,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async receiveWorkMsgResponse(payload) {
    logger.info('Server:receiveWorkMsgResponse');
    try {
      const { connection, channel } = await this.createConnection();

      const queue = MQ_QUEUE_WORK_MSG_RESPONSE;

      channel.assertQueue(queue, {
        durable: true,
      });
      const data = Buffer.from(JSON.stringify(payload));
      channel.sendToQueue(queue, data, {
        persistent: true,
      });
      this.closeConnection(channel, connection);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createConnection() {
    const urlMQ = `amqp://${MQ_USER}:${MQ_PASSQWORD}@${MQ_HOST}`;
    logger.debug(urlMQ);
    const connection = await amqp.connect(urlMQ);
    const channel = await connection.createChannel();
    return { connection, channel };
  }

  closeConnection(channel, connection) {
    setTimeout(() => {
      if (channel) {
        channel.close();
      }
      if (connection) {
        connection.close();
      }
    }, 500);
  }

  handleError(error) {
    logger.error(error);
  }
}

const server = new Server();
server.receiveWorkMsg();
