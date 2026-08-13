const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
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
 *                   items:
 *                     type: array
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   shippingAddress:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId').populate('items.productId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a7e3071a1112ea737c43906
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Single order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                   items:
 *                     type: array
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   shippingAddress:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId').populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *               - items
 *               - totalAmount
 *               - shippingAddress
 *               - paymentMethod
 *             example:
 *               userId: 6a7e24e620cf0c6099927ea6
 *               items:
 *                 - productId: 6a7e306f2454f0cfa58f988f
 *                   quantity: 2
 *                   price: 99.99
 *               totalAmount: 199.98
 *               status: pending
 *               shippingAddress: 123 Main St, Santiago, Chile
 *               paymentMethod: credit_card
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6a7e24e620cf0c6099927ea6
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 6a7e306f2454f0cfa58f988f
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 99.99
 *               totalAmount:
 *                 type: number
 *                 example: 199.98
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: pending
 *               shippingAddress:
 *                 type: string
 *                 example: 123 Main St, Santiago, Chile
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, cash]
 *                 example: credit_card
 *     responses:
 *       201:
 *         description: Order created successfully
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
    const order = new Order({
      userId: req.body.userId,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      status: req.body.status || 'pending',
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod
    });
    const newOrder = await order.save();
    res.status(201).json({ _id: newOrder._id });
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
 * /orders/{id}:
 *   put:
 *     summary: Update an order
 *     tags: [Orders]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a7e3071a1112ea737c43906
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               status: processing
 *               shippingAddress: 456 New St, Santiago, Chile
 *               paymentMethod: paypal
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 6a7e24e620cf0c6099927ea6
 *               items:
 *                 type: array
 *               totalAmount:
 *                 type: number
 *                 example: 199.98
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: processing
 *               shippingAddress:
 *                 type: string
 *                 example: 456 New St, Santiago, Chile
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, cash]
 *                 example: paypal
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                   items:
 *                     type: array
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   shippingAddress:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.userId = req.body.userId || order.userId;
    order.items = req.body.items || order.items;
    order.totalAmount = req.body.totalAmount || order.totalAmount;
    order.status = req.body.status || order.status;
    order.shippingAddress = req.body.shippingAddress || order.shippingAddress;
    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
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
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - session: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a7e3071a1112ea737c43906
 *         description: Order ID
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
