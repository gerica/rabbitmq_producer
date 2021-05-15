import amqplib from 'amqplib';
import config from '../../../config/config.js';
import logger from '../../../utils/logger.js';
import { RABBITMQ_DIRECT } from '../../../utils/constants.js';

const {
  RABBITMQ_HOST,
  RABBITMQ_QUEUE_USER,
  RABBITMQ_EXCHANGE_USER,
  RABBITMQ_ROUTING_KEY,
  //
} = config;

class RabbitMqService {
  async sendToQueueFanout(payload) {
    logger.info('Connect to rabbitmq');
    let connection;
    let channel;
    try {
      logger.debug(`amqp://${RABBITMQ_HOST}`);
      connection = await amqplib.connect(`amqp://${RABBITMQ_HOST}`);
      channel = await connection.createChannel();

      await channel.assertQueue(RABBITMQ_QUEUE_USER, {
        durable: true,
      });
      const data = Buffer.from(JSON.stringify(payload, 'utf8'));

      await channel.sendToQueue(RABBITMQ_QUEUE_USER, data, {
        persistent: true,
      });
      logger.info(payload, '[x] Sent');
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      setTimeout(() => {
        if (channel) {
          channel.close();
        }
        if (connection) {
          connection.close();
        }
      }, 500);
    }
  }

  async sendToQueueDirect(payload) {
    logger.info('Connect to rabbitmq');
    let connection;
    let channel;
    try {
      logger.debug(`amqp://${RABBITMQ_HOST}`);
      connection = await amqplib.connect(`amqp://${RABBITMQ_HOST}`);
      channel = await connection.createChannel();

      channel.assertExchange(RABBITMQ_EXCHANGE_USER, RABBITMQ_DIRECT, {
        durable: false,
      });

      const data = Buffer.from(JSON.stringify(payload, 'utf8'));
      channel.publish(RABBITMQ_EXCHANGE_USER, RABBITMQ_ROUTING_KEY, data);
      logger.info({ RABBITMQ_ROUTING_KEY, payload }, " [x] Sent'");
    } catch (error) {
      this.handleError(error);
      throw error;
    } finally {
      setTimeout(() => {
        if (channel) {
          channel.close();
        }
        if (connection) {
          connection.close();
        }
      }, 500);
    }
  }

  handleError(error) {
    logger.error(error, 'Error with RabbitMq');
  }
}
export default RabbitMqService;
