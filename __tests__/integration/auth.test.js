import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';
import factory from '../factories';

describe('Auth Middleware', () => {
  let newUser;
  beforeEach(async () => {
    const user = await factory.attrs('User', {
      senha: '1234',
    });
    const response = await request(app)
      .post('/signup')
      .send(user);
    newUser = response.body;
  });

  afterEach(async () => {
    await truncate(newUser._id);
  });

  it('Should fail if user does not pass Authorization header', async () => {
    const response = await request(app).get(`/users/123`);
    expect(response.status).toBe(401);
    const errorResponse = { message: 'Não autorizado' };
    expect(response.body).toMatchObject(errorResponse);
  });

  it(`Should fail if user's token is not valid`, async () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZlZmEzNTdlLTNiZWQtNDhkZS1iZjI3LTExNjViODI4N2E3YiIsImlhdCI6MTU3OTU0MjcyNSwiZXhwIjoxNTc5NTQ0NTI1fQ.qs-aqZLwGu5c2Y6JEOtRNH0dInG4mMOA45kqDgRzQzs';

    const response = await request(app)
      .get(`/users/${newUser._id}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(403);
    const errorResponse = { message: 'Sessão inválida' };
    expect(response.body).toMatchObject(errorResponse);
  });
});
