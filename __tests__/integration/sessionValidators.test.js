import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('Session validator signin', () => {
  let newUser;
  beforeEach(async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/signup')
      .send(user);
    newUser = response.body;
  });

  afterEach(async () => {
    await truncate(newUser._id);
  });

  it('Should fail if user forget "senha" field', async () => {
    const response = await request(app)
      .post('/signin')
      .send({
        email: newUser.email,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('flieds');
  });
});
describe('Session validator signup', () => {
  let newUser;
  beforeEach(async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/signup')
      .send(user);
    newUser = response.body;
  });

  afterEach(async () => {
    await truncate(newUser._id);
  });

  it('Should fail if user forget "senha" field', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        email: newUser.email,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('flieds');
  });
});
