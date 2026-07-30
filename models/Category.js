const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true,
    minlength: [5, 'Category description must be at least 5 characters'],
    maxlength: [200, 'Category description cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
