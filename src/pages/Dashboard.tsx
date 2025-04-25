//Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  Users, 
  AlarmClock,
  Bot,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  isComplete: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayReminders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/reminders/today');
        setTodayReminders(res.data.reminders);
      } catch (err) {
        setError('Failed to load today\'s reminders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayReminders();
  }, []);

  const markReminderComplete = async (id: string) => {
    try {
      await axios.put(`/reminders/${id}`, { isComplete: true });
      setTodayReminders(prevReminders => 
        prevReminders.map(reminder => 
          reminder._id === id ? { ...reminder, isComplete: true } : reminder
        )
      );
    } catch (err) {
      console.error('Error marking reminder as complete', err);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'medication': return <AlarmClock className="h-6 w-6 text-red-500" />;
      case 'appointment': return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'exercise': return <Users className="h-6 w-6 text-green-500" />;
      case 'social': return <Users className="h-6 w-6 text-purple-500" />;
      default: return <Bell className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.fullName}</h1>
          <p className="text-xl text-gray-600 mt-2">How are you feeling today?</p>
        </div>
        
        {/* SOS Button */}
        <div className="mb-8">
          <Link to="/emergency-contacts">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center w-full sm:w-auto transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300">
              <AlertCircle className="mr-2 h-6 w-6" />
              SOS Emergency Contact
            </button>
          </Link>
        </div>
        
        {/* Today's Reminders */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Today's Reminders</h2>
            <Link to="/reminders" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
            </div>
          ) : error ? (
            <Card variant="elevated" className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700 text-lg">{error}</p>
            </Card>
          ) : todayReminders.length === 0 ? (
            <Card variant="elevated" className="p-6">
              <p className="text-gray-600 text-xl text-center py-4">No reminders for today</p>
              <div className="text-center">
                <Link to="/reminders">
                  <Button variant="primary" size="lg" className="mt-2">
                    Add New Reminder
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {todayReminders.map(reminder => (
                <Card key={reminder._id} variant="elevated" className={`p-4 ${reminder.isComplete ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="flex items-start">
                    <div className="mr-4">
                      {getCategoryIcon(reminder.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`text-xl font-semibold ${reminder.isComplete ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                          {reminder.title}
                        </h3>
                        <span className="text-lg text-gray-600">{formatDate(reminder.date)}</span>
                      </div>
                      {reminder.description && (
                        <p className={`mt-1 text-lg ${reminder.isComplete ? 'text-gray-500' : 'text-gray-700'}`}>
                          {reminder.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {!reminder.isComplete && (
                    <div className="mt-4 text-right">
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => markReminderComplete(reminder._id)}
                      >
                        Mark as Complete
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Main Service Cards */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Daily Reminders"
            description="Set and track medication, appointments, and other activities"
            icon={Bell}
            to="/reminders"
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          
          <DashboardCard
            title="AI Companion"
            description="Chat with your AI friend for conversation and support"
            icon={Bot}
            to="/ai-chat"
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          
          <DashboardCard
            title="Social Activities"
            description="Find and join local events and activities"
            icon={Calendar}
            to="/social-activities"
            color="text-green-600"
            bgColor="bg-green-100"
          />
          
          <DashboardCard
            title="Community Chat"
            description="Connect and chat with other members"
            icon={MessageSquare}
            to="/group-chat"
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          
          <DashboardCard
            title="Emergency Contacts"
            description="Manage your emergency contacts and SOS settings"
            icon={AlertCircle}
            to="/emergency-contacts"
            color="text-red-600"
            bgColor="bg-red-100"
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;