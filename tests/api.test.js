import request from 'supertest';
import app from '../src/server.js'; // ton fichier express

describe('GET /api/test', () => {
  it('doit retourner 200 et un objet', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
  });
});