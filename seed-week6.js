const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Review = require('./models/Review');

dotenv.config();

async function seedWeek6Data() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get an existing product
    const product = await Product.findOne();
    if (!product) {
      console.log('No products found. Please run npm run seed first.');
      process.exit(1);
    }

    // Create a sample user
    let user = await User.findOne({ email: 'sample.user@gmail.com' });
    if (!user) {
      user = await User.create({
        googleId: 'sample-google-id',
        username: 'sampleuser',
        email: 'sample.user@gmail.com',
        firstName: 'Sample',
        lastName: 'User'
      });
      console.log('Created sample user');
    }

    // Clear previous sample orders and reviews
    await Order.deleteMany({ userId: user._id });
    await Review.deleteMany({ userId: user._id });

    // Create sample order
    const order = await Order.create({
      userId: user._id,
      items: [
        {
          productId: product._id,
          quantity: 2,
          price: product.price
        }
      ],
      totalAmount: product.price * 2,
      status: 'pending',
      shippingAddress: '123 Main St, Santiago, Chile',
      paymentMethod: 'credit_card'
    });
    console.log('Created sample order:', order._id);

    // Create sample review
    const review = await Review.create({
      userId: user._id,
      productId: product._id,
      rating: 5,
      comment: 'Excellent product, highly recommended!'
    });
    console.log('Created sample review:', review._id);

    console.log('Week 6 sample data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding week 6 data:', err);
    process.exit(1);
  }
}

seedWeek6Data();
