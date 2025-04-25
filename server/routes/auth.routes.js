// File: server/routes/auth.routes.js
import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile
} from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);

export default router;