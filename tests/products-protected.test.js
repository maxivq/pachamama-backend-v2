import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app.js';

dotenv.config();

let adminToken;
let createdProductId;

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);

  // Login de admin para obtener token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: process.env.TEST_ADMIN_EMAIL,
      password: process.env.TEST_ADMIN_PASSWORD,
    });

  if (loginRes.status !== 200) {
    throw new Error(`No se pudo hacer login de admin en tests (status ${loginRes.status})`);
  }

  adminToken = loginRes.body.token;
}, 15000);

afterAll(async () => {
  await mongoose.connection.close();
});

test(
  'POST /api/products sin token devuelve 401',
  async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        title: 'Producto test sin token',
        price: 100,
      });

    expect(res.status).toBe(401);
  },
  10000
);

test(
  'POST /api/products con token crea un producto',
  async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Producto test con token',
        description: 'Creado desde tests',
        price: 123.45,
        category: 'Tests',
        imageUrl: 'https://example.com/producto-test.jpg', // requerido por tu schema
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title', 'Producto test con token');

    createdProductId = res.body._id;
  },
  15000
);

test(
  'PUT /api/products/:id con token actualiza el producto',
  async () => {
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Producto test actualizado',
        price: 200,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', createdProductId);
    expect(res.body).toHaveProperty('title', 'Producto test actualizado');
    expect(res.body).toHaveProperty('price', 200);
  },
  15000
);

test(
  'DELETE /api/products/:id con token elimina el producto',
  async () => {
    const res = await request(app)
      .delete(`/api/products/${createdProductId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Tu controller devuelve 204 en delete exitoso
    expect(res.status).toBe(204);
  },
  15000
);