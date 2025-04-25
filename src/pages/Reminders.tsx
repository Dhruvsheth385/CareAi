//Reminders.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { 
  AlarmClock,
  Pill,
  Calendar,
  Dumbbell,
  Users,
  Tag,
  Trash2,
  CheckCircle,
  Edit,
  Plus,
  X
} from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  date: string;
  isComplete: boolean;
  recurring: string;
  category: string;
}

interface ReminderFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  recurring: string;
  category: string;
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [isEditingReminder, setIsEditingReminder] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReminderFormData>();
  
  // Fetch reminders
  useEffect(() => {
    fetchReminders();
  }, []);
  
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/reminders');
      setReminders(res.data.reminders);
      setError(null);
    } catch (err) {
      setError('Failed to load reminders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create reminder
  const createReminder = async (data: ReminderFormData) => {
    try {
      const dateTime = new Date(`${data.date}T${data.time}`);
      
      const reminderData = {
        title: data.title,
        description: data.description,
        date: dateTime.toISOString(),
        recurring: data.recurring,
        category: data.category
      };
      
      const res = await axios.post('/reminders', reminderData);
      setReminders([...reminders, res.data.reminder]);
      setIsAddingReminder(false);
      reset();
    } catch (err) {
      console.error('Error creating reminder:', err);
      setError('Failed to create reminder');
    }
  };
  
  // Update reminder
  const updateReminder = async (id: string, data: ReminderFormData) => {
    try {
      const dateTime = new Date(`${data.date}T${data.time}`);
      
      const reminderData = {
        title: data.title,
        description: data.description,
        date: dateTime.toISOString(),
        recurring: data.recurring,
        category: data.category
      };
      
      const res = await axios.put(`/reminders/${id}`, reminderData);
      
      setReminders(reminders.map(reminder => 
        reminder._id === id ? res.data.reminder : reminder
      ));
      
      setIsEditingReminder(null);
    } catch (err) {
      console.error('Error updating reminder:', err);
      setError('Failed to update reminder');
    }
  };
  
  // Delete reminder
  const deleteReminder = async (id: string) => {
    try {
      await axios.delete(`/reminders/${id}`);
      setReminders(reminders.filter(reminder => reminder._id !== id));
    } catch (err) {
      console.error('Error deleting reminder:', err);
      setError('Failed to delete reminder');
    }
  };
  
  // Toggle reminder completion
  const toggleReminderComplete = async (id: string, isComplete: boolean) => {
    try {
      const res = await axios.put(`/reminders/${id}`, { isComplete: !isComplete });
      
      setReminders(reminders.map(reminder => 
        reminder._id === id ? res.data.reminder : reminder
      ));
    } catch (err) {
      console.error('Error updating reminder completion status:', err);
      setError('Failed to update reminder');
    }
  };
  
  // Start editing a reminder
  const startEditing = (reminder: Reminder) => {
    setIsEditingReminder(reminder._id);
    
    const reminderDate = new Date(reminder.date);
    const dateString = reminderDate.toISOString().split('T')[0];
    const timeString = reminderDate.toTimeString().split(' ')[0].substring(0, 5);
    
    setValue('title', reminder.title);
    setValue('description', reminder.description);
    setValue('date', dateString);
    setValue('time', timeString);
    setValue('recurring', reminder.recurring);
    setValue('category', reminder.category);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'medication':
        return <Pill className="h-6 w-6" />;
      case 'appointment':
        return <Calendar className="h-6 w-6" />;
      case 'exercise':
        return <Dumbbell className="h-6 w-6" />;
      case 'social':
        return <Users className="h-6 w-6" />;
      default:
        return <Tag className="h-6 w-6" />;
    }
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'medication':
        return 'text-red-500 bg-red-100';
      case 'appointment':
        return 'text-blue-500 bg-blue-100';
      case 'exercise':
        return 'text-green-500 bg-green-100';
      case 'social':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };
  
  // Filter reminders
  const filteredReminders = reminders.filter(reminder => {
    if (filterCategory && reminder.category !== filterCategory) return false;
    if (filterStatus === 'completed' && !reminder.isComplete) return false;
    if (filterStatus === 'pending' && reminder.isComplete) return false;
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reminders</h1>
            <p className="text-xl text-gray-600 mt-2">
              Manage your medications, appointments, and activities
            </p>
          </div>
          <Button 
            onClick={() => {
              setIsAddingReminder(true);
              reset();
            }}
            className="mt-4 sm:mt-0 flex items-center justify-center text-lg py-3"
          >
            <Plus className="mr-1 h-5 w-5" />
            Add Reminder
          </Button>
        </div>
        
        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-700 mb-3">Filters</h2>
          <div className="flex flex-wrap gap-3">
            <div>
              <h3 className="text-base font-medium text-gray-600 mb-2">Category</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterCategory(null)}
                  className={`px-3 py-1 rounded-full text-base ${
                    filterCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterCategory('medication')}
                  className={`px-3 py-1 rounded-full text-base flex items-center ${
                    filterCategory === 'medication' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  <Pill className="mr-1 h-4 w-4" />
                  Medication
                </button>
                <button
                  onClick={() => setFilterCategory('appointment')}
                  className={`px-3 py-1 rounded-full text-base flex items-center ${
                    filterCategory === 'appointment' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Calendar className="mr-1 h-4 w-4" />
                  Appointment
                </button>
                <button
                  onClick={() => setFilterCategory('exercise')}
                  className={`px-3 py-1 rounded-full text-base flex items-center ${
                    filterCategory === 'exercise' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                  }`}
                >
                  <Dumbbell className="mr-1 h-4 w-4" />
                  Exercise
                </button>
                <button
                  onClick={() => setFilterCategory('social')}
                  className={`px-3 py-1 rounded-full text-base flex items-center ${
                    filterCategory === 'social' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  <Users className="mr-1 h-4 w-4" />
                  Social
                </button>
                <button
                  onClick={() => setFilterCategory('other')}
                  className={`px-3 py-1 rounded-full text-base flex items-center ${
                    filterCategory === 'other' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Tag className="mr-1 h-4 w-4" />
                  Other
                </button>
              </div>
            </div>
            
            <div className="ml-0 sm:ml-6">
              <h3 className="text-base font-medium text-gray-600 mb-2">Status</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus(null)}
                  className={`px-3 py-1 rounded-full text-base ${
                    filterStatus === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1 rounded-full text-base ${
                    filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1 rounded-full text-base ${
                    filterStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Add/Edit Reminder Form */}
        {(isAddingReminder || isEditingReminder) && (
          <Card variant="elevated" className="mb-8 relative">
            <button 
              onClick={() => {
                setIsAddingReminder(false);
                setIsEditingReminder(null);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isAddingReminder ? 'Add New Reminder' : 'Edit Reminder'}
            </h2>
            
            <form onSubmit={handleSubmit(isEditingReminder ? 
              (data) => updateReminder(isEditingReminder, data) : 
              createReminder
            )}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      className={`mt-1 py-3 px-4 block w-full text-lg rounded-lg border ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Reminder title"
                      {...register('title', { required: 'Title is required' })}
                    />
                    {errors.title && (
                      <p className="mt-1 text-red-600 text-base">{errors.title.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="mt-1 py-3 px-4 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Add details about this reminder"
                      {...register('description')}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-lg font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category"
                      className="mt-1 py-3 px-4 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...register('category', { required: 'Category is required' })}
                    >
                      <option value="medication">Medication</option>
                      <option value="appointment">Appointment</option>
                      <option value="exercise">Exercise</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-lg font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      id="date"
                      type="date"
                      className={`mt-1 py-3 px-4 block w-full text-lg rounded-lg border ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      {...register('date', { required: 'Date is required' })}
                    />
                    {errors.date && (
                      <p className="mt-1 text-red-600 text-base">{errors.date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-lg font-medium text-gray-700">
                      Time *
                    </label>
                    <input
                      id="time"
                      type="time"
                      className={`mt-1 py-3 px-4 block w-full text-lg rounded-lg border ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      {...register('time', { required: 'Time is required' })}
                    />
                    {errors.time && (
                      <p className="mt-1 text-red-600 text-base">{errors.time.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="recurring" className="block text-lg font-medium text-gray-700">
                      Recurring
                    </label>
                    <select
                      id="recurring"
                      className="mt-1 py-3 px-4 block w-full text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      {...register('recurring')}
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsAddingReminder(false);
                    setIsEditingReminder(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isAddingReminder ? 'Add Reminder' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        )}
        
        {/* Reminders List */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50"></div>
            </div>
          ) : error ? (
            <Card variant="elevated" className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700 text-lg">{error}</p>
              <Button onClick={fetchReminders} className="mt-4" variant="primary">
                Try Again
              </Button>
            </Card>
          ) : filteredReminders.length === 0 ? (
            <Card variant="elevated" className="p-12 text-center">
              <AlarmClock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-medium text-gray-600 mb-2">No reminders found</h3>
              <p className="text-gray-500 text-lg mb-6">
                {reminders.length === 0 
                  ? "You haven't created any reminders yet" 
                  : "No reminders match your filter criteria"}
              </p>
              {reminders.length === 0 && (
                <Button
                  onClick={() => {
                    setIsAddingReminder(true);
                    reset();
                  }}
                  className="mx-auto"
                >
                  <Plus className="mr-1 h-5 w-5" />
                  Create Your First Reminder
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredReminders.map(reminder => (
                <Card
                  key={reminder._id}
                  variant="elevated"
                  className={`p-5 transition-all duration-200 ${
                    reminder.isComplete ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className={`p-3 rounded-full ${getCategoryColor(reminder.category)} mr-4`}>
                        {getCategoryIcon(reminder.category)}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${
                          reminder.isComplete ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}>
                          {reminder.title}
                        </h3>
                        {reminder.description && (
                          <p className={`mt-1 text-lg ${
                            reminder.isComplete ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {reminder.description}
                          </p>
                        )}
                        <p className="mt-2 text-base text-gray-500">
                          {formatDate(reminder.date)}
                          {reminder.recurring !== 'none' && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {reminder.recurring.charAt(0).toUpperCase() + reminder.recurring.slice(1)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => toggleReminderComplete(reminder._id, reminder.isComplete)}
                        className={`p-2 rounded-full ${
                          reminder.isComplete ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        } hover:opacity-80 transition-opacity`}
                        title={reminder.isComplete ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        <CheckCircle className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={() => startEditing(reminder)}
                        className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:opacity-80 transition-opacity"
                        title="Edit reminder"
                      >
                        <Edit className="h-6 w-6" />
                      </button>
                      <button 
                        onClick={() => deleteReminder(reminder._id)}
                        className="p-2 rounded-full bg-red-100 text-red-600 hover:opacity-80 transition-opacity"
                        title="Delete reminder"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reminders;