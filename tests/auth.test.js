import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../src/app.js';

dotenv.config();

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});

test(
  'login con credenciales correctas devuelve 200, token y admin',
  async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.TEST_ADMIN_EMAIL,
        password: process.env.TEST_ADMIN_PASSWORD,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');

    expect(res.body).toHaveProperty('admin');
    expect(res.body.admin).toHaveProperty('email', process.env.TEST_ADMIN_EMAIL.toLowerCase());
  },
  10000
);

test(
  'login con contraseña inválida devuelve 401',
  async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.TEST_ADMIN_EMAIL,
        password: 'contraseña_incorrecta',
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
    // opcional: comprobar el mensaje exacto
    // expect(res.body.message).toBe('Credenciales inválidas');
  },
  10000
);