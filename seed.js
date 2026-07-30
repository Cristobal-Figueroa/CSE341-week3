const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories'
  },
  {
    name: 'Clothing',
    description: 'Apparel and fashion items'
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and gardening supplies'
  }
];

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    category: 'Electronics',
    stock: 50,
    sku: 'ELEC-001',
    imageUrl: 'https://example.com/headphones.jpg',
    brand: 'TechSound'
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 149.99,
    category: 'Electronics',
    stock: 30,
    sku: 'ELEC-002',
    imageUrl: 'https://example.com/smartwatch.jpg',
    brand: 'FitTech'
  },
  {
    name: 'Cotton T-Shirt',
    description: '100% cotton comfortable t-shirt in various colors',
    price: 19.99,
    category: 'Clothing',
    stock: 100,
    sku: 'CLOTH-001',
    imageUrl: 'https://example.com/tshirt.jpg',
    brand: 'ComfortWear'
  },
  {
    name: 'Garden Tool Set',
    description: 'Complete set of essential gardening tools',
    price: 45.99,
    category: 'Home & Garden',
    stock: 25,
    sku: 'HOME-001',
    imageUrl: 'https://example.com/gardentools.jpg',
    brand: 'GreenThumb'
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof bluetooth speaker',
    price: 59.99,
    category: 'Electronics',
    stock: 40,
    sku: 'ELEC-003',
    imageUrl: 'https://example.com/speaker.jpg',
    brand: 'SoundWave'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log('Inserted categories:', insertedCategories.length);

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log('Inserted products:', insertedProducts.length);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
