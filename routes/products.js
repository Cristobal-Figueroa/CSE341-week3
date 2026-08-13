const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: string
 *                   stock:
 *                     type: number
 *                   sku:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   brand:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a7e306f2454f0cfa58f988f
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: number
 *                 sku:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 brand:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - stock
 *               - sku
 *               - imageUrl
 *               - brand
 *             example:
 *               name: Gaming Laptop
 *               description: High-performance gaming laptop with RTX 4060
 *               price: 1299.99
 *               category: 6a7e306f2454f0cfa58f988c
 *               stock: 15
 *               sku: ELEC-004
 *               imageUrl: https://example.com/laptop.jpg
 *               brand: GamePro
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Gaming Laptop
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: High-performance gaming laptop with RTX 4060
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 1299.99
 *               category:
 *                 type: string
 *                 example: 6a7e306f2454f0cfa58f988c
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 example: 15
 *               sku:
 *                 type: string
 *                 example: ELEC-004
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/laptop.jpg
 *               brand:
 *                 type: string
 *                 example: GamePro
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      sku: req.body.sku,
      imageUrl: req.body.imageUrl,
      brand: req.body.brand
    });
    const newProduct = await product.save();
    res.status(201).json({ _id: newProduct._id });
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
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a7e306f2454f0cfa58f988f
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Wireless Headphones Pro
 *               description: Updated premium wireless headphones
 *               price: 129.99
 *               category: 6a7e306f2454f0cfa58f988c
 *               stock: 45
 *               sku: ELEC-001
 *               imageUrl: https://example.com/headphones.jpg
 *               brand: TechSound
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: Wireless Headphones Pro
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 500
 *                 example: Updated premium wireless headphones
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 129.99
 *               category:
 *                 type: string
 *                 example: 6a7e306f2454f0cfa58f988c
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 example: 45
 *               sku:
 *                 type: string
 *                 example: ELEC-001
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/headphones.jpg
 *               brand:
 *                 type: string
 *                 example: TechSound
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: number
 *                 sku:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 brand:
 *                   type: string
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
    product.sku = req.body.sku || product.sku;
    product.imageUrl = req.body.imageUrl || product.imageUrl;
    product.brand = req.body.brand || product.brand;
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
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
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 6a7e306f2454f0cfa58f988f
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
