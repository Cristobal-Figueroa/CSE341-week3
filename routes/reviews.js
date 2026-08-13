const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('userId').populate('productId');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Single review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('userId').populate('productId');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - session: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const review = new Review({
      userId: req.body.userId,
      productId: req.body.productId,
      rating: req.body.rating,
      comment: req.body.comment
    });
    const newReview = await review.save();
    res.status(201).json({ _id: newReview._id });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               productId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   comment:
 *                     type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.userId = req.body.userId || review.userId;
    review.productId = req.body.productId || review.productId;
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
