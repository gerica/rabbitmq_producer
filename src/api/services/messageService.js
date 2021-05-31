import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger.js';

const fakeDatabase = [];
class MessageService {
  async allMsg() {
    logger.info('allMsg');
    logger.debug(fakeDatabase);
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeDatabase), 1000);
    });
  }

  setMessage(message) {
    logger.info('MessageService:setMessage');
    const id = uuidv4();
    const newMsg = { id, message };
    fakeDatabase.push(newMsg);
    return newMsg;
  }
}
export default MessageService;
