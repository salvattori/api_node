import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('SingUp', () => {
  it('Should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      senha: 'senhatest',
    });
    const compareHash = await bcrypt.compareSync('senhatest', user.senha);
    expect(compareHash).toBeTruthy();
    await truncate(user._id);
  });

  it('Should be able to register', async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/signup')
      .send(user);
    expect(response.body).toHaveProperty('_id');
    await truncate(response.body._id);
  });

  it('Should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');
    const firstUser = await request(app)
      .post('/signup')
      .send(user);

    const response = await request(app)
      .post('/signup')
      .send(user);
    const erroResponse = { message: 'E-mail já existe' };
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(erroResponse);
    await truncate(firstUser.body._id);
  });
});
