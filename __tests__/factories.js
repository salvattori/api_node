import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../src/app/models/User';

factory.define('User', User, {
  nome: faker.name.firstName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  telefones: [
    {
      ddd: '12',
      numero: '981940442',
    },
  ],
});

export default factory;
