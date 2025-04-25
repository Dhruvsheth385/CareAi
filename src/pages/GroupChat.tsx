//GroupChat.tsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Send, User as UserIcon, Users, Hash } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AuthContext from '../context/AuthContext';

interface Message {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    profilePhoto?: string;
  };
  room: string;
  text: string;
  createdAt: string;
}

const ROOMS = [
  { id: 'general', name: 'General Chat', description: 'Chat about anything and everything' },
  { id: 'health', name: 'Health & Wellness', description: 'Discuss health tips and wellness' },
  { id: 'hobbies', name: 'Hobbies & Interests', description: 'Share your favorite activities' },
  { id: 'support', name: 'Support Group', description: 'Give and receive emotional support' }
];

const GroupChat: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
      withCredentials: true
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
  // Join room when socket is ready or room changes
  useEffect(() => {
    if (socket && currentRoom) {
      // Leave any previous room
      socket.emit('join_room', currentRoom);
      
      // Load message history for this room
      fetchMessages(currentRoom);
    }
  }, [socket, currentRoom]);
  
  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    
    socket.on('receive_message', (data) => {
      // Only add message if it's for the current room
      if (data.room === currentRoom) {
        setMessages(prev => [...prev, data.message]);
      }
    });
    
    return () => {
      socket.off('receive_message');
    };
  }, [socket, currentRoom]);
  
  // Fetch message history
  const fetchMessages = async (room: string) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/chat/${room}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !user) return;
    
    try {
      const messageData = {
        room: currentRoom,
        text: newMessage
      };
      
      // Save message to database
      const res = await axios.post('/chat', messageData);
      
      // Emit message to all users in the room
      socket.emit('send_message', {
        room: currentRoom,
        message: res.data.message
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Change chat room
  const changeRoom = (roomId: string) => {
    setCurrentRoom(roomId);
  };
  
  // Format date
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get current room info
  const currentRoomInfo = ROOMS.find(room => room.id === currentRoom);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Community Chat</h1>
          <p className="text-xl text-gray-600 mt-2">
            Connect with other members in real-time chat rooms
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[700px]">
          {/* Chat Rooms List */}
          <div className="md:col-span-1">
            <Card variant="elevated" className="h-full overflow-hidden flex flex-col">
              <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-blue-600" />
                  Chat Rooms
                </h2>
              </div>
              
              <div className="overflow-y-auto flex-grow">
                {ROOMS.map(room => (
                  <button
                    key={room.id}
                    onClick={() => changeRoom(room.id)}
                    className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      currentRoom === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <Hash className={`mr-3 h-5 w-5 mt-1 ${
                        currentRoom === room.id ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <div>
                        <h3 className={`font-medium ${
                          currentRoom === room.id ? 'text-blue-800' : 'text-gray-800'
                        }`}>
                          {room.name}
                        </h3>
                        <p className="text-sm text-gray-500">{room.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-4 bg-gray-100 border-t border-gray-200 mt-auto">
                <p className="text-sm text-gray-600">
                  All messages are visible to everyone in the room.
                </p>
              </div>
            </Card>
          </div>
          
          {/* Chat Messages */}
          <div className="md:col-span-3">
            <Card variant="elevated" className="h-full flex flex-col">
              <div className="p-4 bg-gray-100 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Hash className="mr-2 h-5 w-5 text-blue-600" />
                  {currentRoomInfo?.name || 'Chat Room'}
                </h2>
                <p className="text-gray-600">{currentRoomInfo?.description}</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Users className="h-12 w-12 mb-4 text-gray-400" />
                    <p className="text-xl">No messages yet in this room</p>
                    <p className="mt-2">Be the first to send a message!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.sender._id === user?._id;
                    
                    return (
                      <div
                        key={message._id}
                        className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            isCurrentUser ? 'bg-blue-100 ml-3' : 'bg-gray-200 mr-3'
                          }`}>
                            {message.sender.profilePhoto ? (
                              <img 
                                src={message.sender.profilePhoto} 
                                alt={message.sender.fullName}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className={`h-6 w-6 ${isCurrentUser ? 'text-blue-600' : 'text-gray-600'}`} />
                            )}
                          </div>
                          <div>
                            <div 
                              className={`py-3 px-4 rounded-2xl text-lg ${
                                isCurrentUser 
                                  ? 'bg-blue-600 text-white rounded-tr-none' 
                                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
                              }`}
                            >
                              {message.text}
                            </div>
                            <div className={`flex items-center mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-500 mr-2">
                                {formatMessageTime(message.createdAt)}
                              </span>
                              <span className="text-xs font-medium text-gray-700">
                                {isCurrentUser ? 'You' : message.sender.fullName}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef}></div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here..."
                    className="flex-1 py-3 px-4 block text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  ></textarea>
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="ml-3 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupChat;