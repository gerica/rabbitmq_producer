/* eslint-disable class-methods-use-this */
import logger from '../../utils/logger.js';

const fakeDatabase = [];
let currentId = -1;
class ServiceUser {
  async allMsg() {
    logger.info('allMsg');
    logger.debug(fakeDatabase);
    return new Promise((resolve) => {
      setTimeout(() => resolve(fakeDatabase), 1000);
    });
  }

  async createUser({ nome, sobrenome }) {
    logger.info('criateUser');

    const id = 1 + Math.floor(Math.random() * 100);
    currentId += 1;
    const newObj = { id, nome, sobrenome };
    fakeDatabase[currentId] = newObj;

    return new Promise((resolve) => {
      setTimeout(() => resolve(newObj), 1000);
    });
  }
}
export default ServiceUser;
