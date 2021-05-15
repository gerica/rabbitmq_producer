import { ExampleService } from '../../api/services/index.js';

const service = new ExampleService();

const query = {
  example1: () => service.example1(),
  example2: () => service.example2(),
  example3: (_, { input }) => service.example3(input),
  allMsg: () => service.allMsg(),
};
const mutation = {
  example4: (_, { input }) => service.example4(input),
  criateUser: (_, { inputUser }) => service.criateUser(inputUser),
};
export { query, mutation };
