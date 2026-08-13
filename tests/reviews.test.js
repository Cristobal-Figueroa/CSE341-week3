const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Review = require('../models/Review');

describe('Reviews API - GET endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /reviews', () => {
    it('should return all reviews', async () => {
      const response = await request(app).get('/reviews');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /reviews/:id', () => {
    it('should return a single review by ID', async () => {
      const review = await Review.findOne();
      if (!review) {
        console.log('No reviews found in database');
        return;
      }
      const response = await request(app).get(`/reviews/${review._id}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(review._id.toString());
    });

    it('should return 404 for non-existent review', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/reviews/${fakeId}`);
      expect(response.status).toBe(404);
    });
  });
});
