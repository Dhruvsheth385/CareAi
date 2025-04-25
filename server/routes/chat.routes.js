// File: server/routes/chat.routes.js
import express from 'express';
import {
  getMessages,
  saveMessage,
  getAIResponse
} from '../controllers/chat.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/:room', getMessages);
router.post('/', saveMessage);
router.post('/ai', getAIResponse);

export default router;