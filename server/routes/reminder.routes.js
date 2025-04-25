// File: server/routes/reminder.routes.js
import express from 'express';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getTodayReminders
} from '../controllers/reminder.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);
router.get('/today', getTodayReminders);

export default router;