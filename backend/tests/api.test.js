const request = require('supertest');
const app = require('../src/app');

describe('🐶 PetCare Store API Automated Test Suite', () => {
  let customerToken = '';
  let adminToken = '';
  let testPetId = null;
  let testServiceId = null;
  let testBookingId = null;

  beforeAll(async () => {
    // Wait for DB initialization
    await new Promise((resolve) => setTimeout(resolve, 300));
  });

  // 1. Health Check Test
  test('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  // 2. Authentication Tests
  describe('🔐 Authentication Endpoints', () => {
    test('POST /api/auth/login as Admin should succeed', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@petcare.com', password: 'admin123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('admin');
      adminToken = res.body.token;
    });

    test('POST /api/auth/login as Customer should succeed', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'customer@gmail.com', password: 'customer123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.role).toBe('customer');
      customerToken = res.body.token;
    });

    test('POST /api/auth/login with wrong password should return 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@petcare.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('không chính xác');
    });

    test('POST /api/auth/register should create new customer user', async () => {
      const randomEmail = `testuser_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Customer',
          email: randomEmail,
          password: 'password123',
          phone: '0999888777'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(randomEmail);
    });
  });

  // 3. Services API Tests
  describe('✂️ Services Endpoints', () => {
    test('GET /api/services should list all services', async () => {
      const res = await request(app).get('/api/services');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      testServiceId = res.body[0].id;
    });

    test('POST /api/services as Admin should create a new service', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Tắm & Massage Thảo Dược Thư Giãn',
          description: 'Massage bấm huyệt giúp thú cưng giảm căng thẳng',
          price: 180000,
          duration_mins: 45,
          category: 'bath'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.service.name).toBe('Tắm & Massage Thảo Dược Thư Giãn');
    });

    test('POST /api/services as Customer should return 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Service Unauthorized',
          price: 100000
        });

      expect(res.statusCode).toBe(403);
    });
  });

  // 4. Products API Tests
  describe('🦴 Products Endpoints', () => {
    test('GET /api/products should return product catalog', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  // 5. Pets API Tests
  describe('🐾 Pets Endpoints', () => {
    test('GET /api/pets/my-pets should return user pets', async () => {
      const res = await request(app)
        .get('/api/pets/my-pets')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      if (res.body.length > 0) {
        testPetId = res.body[0].id;
      }
    });

    test('POST /api/pets should add a new pet profile', async () => {
      const res = await request(app)
        .post('/api/pets')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Cún Corgi Mèo',
          type: 'dog',
          breed: 'Corgi Pembroke',
          age: 1,
          weight: 8.5,
          notes: 'Thích ăn thịt gà'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.pet.name).toBe('Cún Corgi Mèo');
      testPetId = res.body.pet.id;
    });
  });

  // 6. Bookings API Tests
  describe('📅 Bookings Endpoints', () => {
    test('POST /api/bookings should create a new appointment', async () => {
      const today = new Date().toISOString().split('T')[0];
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          pet_id: testPetId,
          service_id: testServiceId,
          booking_date: today,
          booking_time: '14:30',
          notes: 'Test booking notes'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.booking.status).toBe('pending');
      testBookingId = res.body.booking.id;
    });

    test('PATCH /api/bookings/:id/status as Admin should update booking status', async () => {
      if (!testBookingId) return;

      const res = await request(app)
        .patch(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.booking.status).toBe('confirmed');
    });
  });

  // 7. Admin Dashboard Summary Test
  describe('📊 Admin Dashboard Endpoint', () => {
    test('GET /api/dashboard/summary as Admin should return statistics', async () => {
      const res = await request(app)
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total_customers');
      expect(res.body).toHaveProperty('total_pets');
      expect(res.body).toHaveProperty('total_bookings');
    });
  });
});
