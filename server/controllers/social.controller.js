// File: server/controllers/social.controller.js
import SocialActivity from '../models/SocialActivity.js';

// Get all activities
export const getSocialActivities = async (req, res) => {
  try {
    const activities = await SocialActivity.find().sort({ date: 1 });
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create new activity
export const createActivity = async (req, res) => {
  try {
    const { title, description, category, date, location } = req.body;

    const newActivity = new SocialActivity({
      title,
      description,
      category,
      date,
      location,
      organizer: {
        name: req.user.fullName,
        contact: req.user.email
      },
      participants: [req.user.id]
    });

    await newActivity.save();
    res.status(201).json({ activity: newActivity });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Join an activity
export const joinActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await SocialActivity.findById(id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    if (!activity.participants.includes(userId)) {
      activity.participants.push(userId);
      await activity.save();
    }

    res.json({ activity });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Leave an activity
export const leaveActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await SocialActivity.findById(id);
    if (!activity) return res.status(404).json({ error: "Activity not found" });

    activity.participants = activity.participants.filter(p => p.toString() !== userId);
    await activity.save();

    res.json({ activity });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
