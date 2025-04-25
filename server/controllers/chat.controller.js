//chat.controller.js
// File: server/controllers/chat.controller.js
import Message from '../models/Message.js';

// Get all messages for a specific chat room
export const getMessages = async (req, res) => {
  try {
    const { room } = req.params;
    
    const messages = await Message.find({ room })
      .populate('sender', 'fullName profilePhoto')
      .sort({ createdAt: 1 });
    
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save a message to the database
export const saveMessage = async (req, res) => {
  try {
    const { room, text } = req.body;
    
    const message = new Message({
      sender: req.user.id,
      room,
      text
    });
    
    await message.save();
    
    // Populate sender info for the response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'fullName profilePhoto');
    
    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get AI response
export const getAIResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    // This would normally call the Gemini API
    // For now, we'll simulate a response
    const aiResponse = {
      text: `AI response to: "${message}"`,
      timestamp: new Date()
    };
    
    // In a real implementation, you would call the Gemini API here
    // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     contents: [{ parts: [{ text: message }] }]
    //   })
    // });
    
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};