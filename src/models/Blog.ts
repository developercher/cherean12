import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: String,
  coverImage: String,
  cloudinaryId: String,
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  tags: [String],
  author: {
    name: String,
    image: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema); 