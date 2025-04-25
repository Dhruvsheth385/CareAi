// File: server/models/SocialActivity.js
import mongoose from 'mongoose';

const socialActivitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  date: { type: Date, required: true },
  category: {
    type: String,
    enum: ['exercise', 'education', 'entertainment', 'hobby', 'volunteering', 'social', 'other'],
    default: 'social'
  },
  organizer: {
    name: String,
    contact: String
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const SocialActivity = mongoose.model('SocialActivity', socialActivitySchema);
export default SocialActivity;
