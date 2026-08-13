const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Order = require('../models/Order');

describe('Orders API - GET endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const response = await request(app).get('/orders');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a single order by ID', async () => {
      const order = await Order.findOne();
      if (!order) {
        console.log('No orders found in database');
        return;
      }
      const response = await request(app).get(`/orders/${order._id}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(order._id.toString());
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/orders/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});
