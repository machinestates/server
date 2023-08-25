require('dotenv').config();

const app = require('../../app');
const supertest = require('supertest');
const request = supertest(app);

describe('POST /api/tokens/nft', () => {

  beforeEach(async () => {
    const user = { emailusername: 'erik@erikaugust.com', password: process.env.ENTRY_PASSWORD };
    const response = await request.post('/api/users/me')
        .set('Accept', 'application/json')
        .send({ user })
    token = response.body.user.token;
  });

  test('should return 200 success when valid token is passed', async () => {

    const body = {
      image: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      wallet: '0x1234567890123456789012345678901234567890'
    };
    
    const response = await request.post(`/api/tokens/nft`)
    .set('Authorization', 'Bearer ' + token)
    .set('Accept', 'application/json')
    .send(body);
    
    expect(response.status).toBe(200);
    expect(response.body.username).toBeTruthy();
  });
});