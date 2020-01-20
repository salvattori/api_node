import request from 'supertest';
import bcrypt from 'bcrypt';
import faker from 'faker';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('SignIn', () => {
  it('It should fail when email do not exist', async () => {
    const user = {
      email: faker.internet.email(),
      senha: faker.internet.password(),
    };

    const response = await request(app)
      .post('/signin')
      .send(user);
    const erroResponse = { message: 'Usuário e/ou senha inválidos' };

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject(erroResponse);
  });

  it('Should fail if user password do not match', async () => {
    const userWithHash = await factory.attrs('User');

    const compareHash = await bcrypt.compareSync(
      faker.internet.password(),
      userWithHash.senha
    );
    expect(compareHash).toBeFalsy();
  });

  it('Should return "Usuário e/ou senha inválidos" if user password do not match', async () => {
    const tempUser = await factory.create('User');
    const user = {
      email: tempUser.email,
      senha: faker.internet.password(),
    };
    const response = await request(app)
      .post('/signin')
      .send(user);

    expect(response.status).toBe(401);

    const erroResponse = { message: 'Usuário e/ou senha inválidos' };
    expect(response.body).toMatchObject(erroResponse);
    await truncate(tempUser._id);
  });

  it('Should create new JWT', async () => {
    const senha = faker.internet.password();
    const tempUser = await factory.create('User', { senha });
    const user = {
      email: tempUser.email,
      senha,
    };
    const response = await request(app)
      .post('/signin')
      .send(user);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('token');
    await truncate(tempUser._id);
  });
});
