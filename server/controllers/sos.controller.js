//sos.controller.js
// File: server/controllers/sos.controller.js
import User from '../models/User.js';

// Send SOS alert to emergency contacts
export const sendSOSAlert = async (req, res) => {
  try {
    const { location } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has emergency contacts
    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({ message: 'No emergency contacts found. Please add emergency contacts to your profile.' });
    }
    
    // In a real implementation, this would send emails/SMS to emergency contacts
    // with the user's location information
    
    const emergencyContactNames = user.emergencyContacts.map(contact => contact.name);
    
    res.status(200).json({
      message: 'SOS alert sent successfully',
      sentTo: emergencyContactNames,
      location
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's emergency contacts
export const getEmergencyContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ emergencyContacts: user.emergencyContacts || [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add emergency contact
export const addEmergencyContact = async (req, res) => {
  try {
    const { name, relationship, phone, email } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newContact = { name, relationship, phone, email };
    
    if (!user.emergencyContacts) {
      user.emergencyContacts = [newContact];
    } else {
      user.emergencyContacts.push(newContact);
    }
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Emergency contact added successfully',
      emergencyContacts: user.emergencyContacts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};