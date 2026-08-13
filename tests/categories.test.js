const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Category = require('../models/Category');

describe('Categories API - GET endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /categories', () => {
    it('should return all categories', async () => {
      const response = await request(app).get('/categories');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /categories/:id', () => {
    it('should return a single category by ID', async () => {
      const category = await Category.findOne();
      if (!category) {
        console.log('No categories found in database');
        return;
      }
      const response = await request(app).get(`/categories/${category._id}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(category._id.toString());
    });

    it('should return 404 for non-existent category', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/categories/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});
