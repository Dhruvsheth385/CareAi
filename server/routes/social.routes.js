// File: server/routes/social.routes.js
import express from 'express';
import {
  getSocialActivities,
  createActivity,
  joinActivity,
  leaveActivity
} from '../controllers/social.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', getSocialActivities);
router.post('/', createActivity);
router.post('/:id/join', joinActivity);
router.post('/:id/leave', leaveActivity);

export default router;
