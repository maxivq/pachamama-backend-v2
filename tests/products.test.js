import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
}, 10000); // timeout extra para la conexión

afterAll(async () => {
  await mongoose.connection.close();
});

// OJO: sacamos jest.setTimeout

test(
  'GET /api/products responde 200 y tiene estructura básica correcta',
  async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);

    // Verificamos que tenga las propiedades básicas
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    expect(res.body).toHaveProperty('totalPages');
    expect(typeof res.body.totalPages).toBe('number');

    expect(res.body).toHaveProperty('page');
    expect(typeof res.body.page).toBe('number');

    expect(res.body).toHaveProperty('limit');
    expect(typeof res.body.limit).toBe('number');
  },
  10000 // timeout para este test en particular (10s)
);