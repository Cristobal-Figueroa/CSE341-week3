const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');

describe('Products API - GET endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/products');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /products/:id', () => {
    it('should return a single product by ID', async () => {
      const product = await Product.findOne();
      if (!product) {
        console.log('No products found in database');
        return;
      }
      const response = await request(app).get(`/products/${product._id}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(product._id.toString());
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/products/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});
