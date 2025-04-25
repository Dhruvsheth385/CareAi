import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, required: true },
  interests: { type: [String], default: [] },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String,
    email: String
  }],
  profilePhoto: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
