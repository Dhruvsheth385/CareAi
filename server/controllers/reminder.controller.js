//reminder.controller.js
// File: server/controllers/reminder.controller.js
import Reminder from '../models/Reminder.js';

// Get all reminders for a user
export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ date: 1 });
    res.status(200).json({ reminders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new reminder
export const createReminder = async (req, res) => {
  try {
    const { title, description, date, recurring, category } = req.body;
    
    const reminder = new Reminder({
      user: req.user.id,
      title,
      description,
      date,
      recurring,
      category
    });
    
    await reminder.save();
    res.status(201).json({ reminder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a reminder
export const updateReminder = async (req, res) => {
  try {
    const { title, description, date, isComplete, recurring, category } = req.body;
    
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Verify that the reminder belongs to the user
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this reminder' });
    }
    
    if (title) reminder.title = title;
    if (description !== undefined) reminder.description = description;
    if (date) reminder.date = date;
    if (isComplete !== undefined) reminder.isComplete = isComplete;
    if (recurring) reminder.recurring = recurring;
    if (category) reminder.category = category;
    
    await reminder.save();
    res.status(200).json({ reminder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a reminder
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Verify that the reminder belongs to the user
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this reminder' });
    }
    
    await reminder.deleteOne();
    res.status(200).json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get today's reminders
export const getTodayReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminders = await Reminder.find({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: 1 });
    
    res.status(200).json({ reminders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};