import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// TEMP: Use first user in DB (or create one if none)
const getUser = async () => {
  let user = await User.findOne();
  if (!user) {
    user = new User({ fullName: 'Demo User', email: 'demo@example.com', password: 'test123', emergencyContacts: [] });
    await user.save();
  }
  return user;
};

// GET contacts
router.get('/contacts', async (req, res) => {
  const user = await getUser();
  res.json({ emergencyContacts: user.emergencyContacts });
});

// POST contact
router.post('/contacts', async (req, res) => {
  const user = await getUser();
  user.emergencyContacts.push(req.body);
  await user.save();
  res.status(201).json({ emergencyContacts: user.emergencyContacts });
});

// DELETE contact
router.delete('/contacts/:id', async (req, res) => {
  const user = await getUser();
  user.emergencyContacts = user.emergencyContacts.filter(
    contact => contact._id.toString() !== req.params.id
  );
  await user.save();
  res.status(200).json({ emergencyContacts: user.emergencyContacts });
});

export default router;
