import request from 'supertest';
import bcrypt from 'bcrypt';
import faker from 'faker';

import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('findById', () => {
  let newUser;
  beforeEach(async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/signup')
      .send(user);
    console.log('before', response.body);
    newUser = response.body;
  });

  afterEach(async () => {
    console.log('deleting');
    await truncate(newUser._id);
  });

  it('Should fail if user_id does not exits', async () => {
    const response = await request(app)
      .get(`/users/123`)
      .set('authorization', `Bearer ${newUser.token}`);
    expect(response.status).toBe(404);
  });

  it('Should fail if user_id do not match token id', async () => {
    const user = await factory.create('User', {
      email: faker.internet.email(),
    });
    console.log('user', user);

    const {
      body: { token },
    } = await request(app)
      .post('/signup')
      .send(user);

    console.log(token);

    const response = await request(app)
      .get(`/users/${newUser._id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});
