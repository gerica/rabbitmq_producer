/* eslint-disable class-methods-use-this */
import logger from '../../utils/logger.js';
import RabbitMqService from './mq/rabbitMQService.js';

const fakeDatabase = [];
let currentId = -1;
const rabbitMqService = new RabbitMqService();
class ExampleService {
  example1() {
    logger.info('example1');
    return 'Example 1 success!!!';
  }

  example2() {
    logger.info('example2');
    return { result1: 'Example 2 success!!!' };
  }

  async example3({ msg1 }) {
    logger.info('example3');

    return new Promise((resolve) => {
      setTimeout(() => resolve({ result1: `"Example 3 success!!! ${msg1}` }), 1000);
    });
  }

  async example4({ msg1 }) {
    logger.info('example4');

    const id = 1 + Math.floor(Math.random() * 100);
    currentId += 1;
    const newMsg = { id, result1: `Example 3 success!!! ${msg1}` };
    fakeDatabase[currentId] = newMsg;

    return new Promise((resolve) => {
      setTimeout(() => resolve(newMsg), 1000);
    });
  }

  async allMsg() {
    logger.info('allMsg');
    logger.debug(fakeDatabase);
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeDatabase), 1000);
    });
  }

  async criateUser(payload) {
    logger.info('criateUser');

    // const id = 1 + Math.floor(Math.random() * 100);
    // currentId += 1;
    // fakeDatabase[currentId] = newObj;
    // await rabbitMqService.sendToQueueDirect(newObj);
    await rabbitMqService.sendToQueueFanout(payload);

    return new Promise((resolve) => {
      setTimeout(() => resolve({}), 1000);
    });
  }
}
export default ExampleService;
