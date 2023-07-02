require('dotenv').config();

const app = require('../../app');
const supertest = require('supertest');
const request = supertest(app);

const User = require('../../shared/user');
const JWT = require('../../shared/jwt');

describe('POST /api/users', () => {
  test('should return 200 success when valid user is created', async () => {
    const user = { username: 'test1337', email: 'eriktest@machinestates.com', password: 'password1' };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send({ user })
    await User.remove(user.username);
    expect(response.status).toBe(200);
    expect(response.body.user.token).toBeTruthy();
    expect(response.body.user.username).toBeTruthy();
  });

  test('should return 500 failure when Internal Server Error', async () => {
    jest
        .spyOn(User, 'create')
        .mockImplementationOnce(() => {
    throw new Error('Internal Server Error');
    });

    const user = { username: 'test1337', email: 'eriktest@machinestates.com', password: 'password1' };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(500);
  });

  test('should return 400 failure when username is not sent', async () => {
    const body = { user: { email: 'eriktest@machinestates.com', password: 'test' } };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Username is not set' });
  });

  test('should return 400 failure when email is not sent', async () => {
    const body = { user: { username: 'test1337', password: 'test' } };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email is not set' });
  });

  test('should return 400 failure when password is not sent', async () => {
    const body = { user: { username: 'test1337', email: 'eriktest@machinestates.com' } };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Password is not set' });
  });

  test('should return 400 failure when password is not strong enough', async () => {
    const body = { user: { username: 'test1337', email: 'eriktest@machinestates.com', password: 'love' } };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Password is not strong enough' });
  });

  test('should return 401 failure if username exist or is reserved', async () => {
    const body = { user: { username: 'test', email: 'eriktest@machinestates.com', password: 'password1' } };
    const response = await request.post('/api/users')
        .set('Accept', 'application/json')
        .send(body);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'The requested username is unavailable' });
  });
});

describe('POST /api/users/me', () => {
  test('should return 200 success when valid credentials (email) are passed', async () => {
    const user = { emailusername: 'erik@erikaugust.com', password: process.env.ENTRY_PASSWORD };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(200);
    expect(response.body.user.token).toBeTruthy();
    expect(response.body.user.email).toBeTruthy();
  });

  test('should return 500 failure when error is thrown', async () => {
    jest
        .spyOn(JWT, 'generate')
        .mockImplementationOnce(() => {
        throw new Error('Internal Server Error');
    });
    const user = { emailusername: 'erik@erikaugust.com', password: process.env.ENTRY_PASSWORD };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(500);
  });

  test('should return 400 failure when password is not passed', async () => {
    const user = { emailusername: 'erik@erikaugust.com' };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(400);
  });

  test('should return 400 failure when username is not passed', async () => {
    const user = { password: 'eaj' };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(400);
  });

  test('should return 404 failure when username does not exist', async () => {
    const user = { emailusername: 'test1337', password: 'password1' };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(404);
  });

  test('should return 404 failure when password is incorrect', async () => {
    const user = { emailusername: 'erik@erikaugust.com', password: 'password1' };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    expect(response.status).toBe(404);
  });
});

describe('GET /api/users/me/items', () => {  

  beforeEach(async () => {
    const user = { emailusername: 'erik@erikaugust.com', password: process.env.ENTRY_PASSWORD };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    token = response.body.user.token;
  });

  test('should return 200 success when valid token is passed', async () => {
    
    const response = await request.get(`/api/users/me/items`)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.body.items).toBeTruthy();
  });
});