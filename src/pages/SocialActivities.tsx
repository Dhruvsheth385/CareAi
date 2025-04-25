import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Plus, Users, Calendar, Clock, Tag } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const SocialActivities: React.FC = () => {
  const mockActivities = [
    {
      _id: '1',
      title: 'Morning Yoga Session',
      description: 'Join us for a refreshing yoga session in the park.',
      date: new Date().toISOString(),
      category: 'health',
      location: {
        coordinates: { lat: 28.6139, lng: 77.2090 },
      },
      participants: [],
    },
    {
      _id: '2',
      title: 'Art Workshop',
      description: 'Explore your creativity with paints and brushes!',
      date: new Date(Date.now() + 86400000).toISOString(),
      category: 'education',
      location: {
        coordinates: { lat: 28.6155, lng: 77.2100 },
      },
      participants: [],
    },
    {
      _id: '3',
      title: 'Community Gardening',
      description: 'Help us plant and maintain the community garden.',
      date: new Date(Date.now() + 2 * 86400000).toISOString(),
      category: 'volunteering',
      location: {
        coordinates: { lat: 28.6170, lng: 77.2080 },
      },
      participants: [],
    },
  ];

  const [activities, setActivities] = useState(mockActivities);
  const [modalOpen, setModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', category: '', lat: '', lng: '' });
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get('/api/social');
      if (res.data.activities && res.data.activities.length > 0) {
        setActivities(res.data.activities);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.category || !markerPosition) {
      alert('Please fill all fields and select a location on the map.');
      return;
    }

    try {
      const payload = {
        ...newEvent,
        location: {
          coordinates: {
            lat: markerPosition[0],
            lng: markerPosition[1],
          },
        },
      };
      const res = await axios.post('/api/social', payload);
      setActivities((prev) => [...prev, res.data.activity]);
      setModalOpen(false);
      setNewEvent({ title: '', description: '', date: '', category: '', lat: '', lng: '' });
      setMarkerPosition(null);
    } catch (err) {
      console.error('Error submitting activity:', err);
    }
  };

  const joinActivity = async (id: string) => {
    try {
      await axios.post(`/api/social/${id}/join`);
      fetchActivities();
    } catch (err) {
      console.error('Error joining activity:', err);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        setNewEvent((prev) => ({ ...prev, lat: lat.toString(), lng: lng.toString() }));
      },
    });

    return markerPosition ? (
      <Marker position={markerPosition}>
        <Popup>Selected Location</Popup>
      </Marker>
    ) : null;
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || activity.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Social Activities</h1>
          <Button onClick={() => setModalOpen(true)} className="flex items-center">
            <Plus className="h-5 w-5 mr-2" /> Add New Activity
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Categories</option>
            <option value="social">Social</option>
            <option value="volunteering">Volunteering</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
        </div>

        <Card className="mb-8 p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Map of Activities</h2>
          <div className="h-[400px]">
            <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {activities.map((activity) => (
                <Marker
                  key={activity._id}
                  position={[activity.location.coordinates.lat, activity.location.coordinates.lng]}
                  icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png' })}
                >
                  <Popup>
                    <strong>{activity.title}</strong><br />
                    {new Date(activity.date).toLocaleString()}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Activities</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <Card key={activity._id} className="p-4">
              <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
              <div className="text-sm space-y-1 text-gray-700">
                <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {new Date(activity.date).toLocaleDateString()}</div>
                <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {new Date(activity.date).toLocaleTimeString()}</div>
                <div className="flex items-center"><Users className="h-4 w-4 mr-1" /> {activity.participants.length} joined</div>
                <div className="flex items-center"><Tag className="h-4 w-4 mr-1" /> {activity.category}</div>
              </div>
              <Button onClick={() => joinActivity(activity._id)} className="mt-3 w-full">
                Join Activity
              </Button>
            </Card>
          ))}
        </div>
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit New Activity">
        <div className="space-y-4">
          {['title', 'description', 'category', 'date'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              <input
                type={field === 'date' ? 'datetime-local' : 'text'}
                value={newEvent[field as keyof typeof newEvent]}
                onChange={(e) => setNewEvent((prev) => ({ ...prev, [field]: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          ))}
          <div className="h-[300px] w-full overflow-hidden rounded-lg mb-4">
            <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
          </div>
          {markerPosition && (
            <p className="text-sm text-gray-700">Selected Location: Lat {markerPosition[0].toFixed(5)}, Lng {markerPosition[1].toFixed(5)}</p>
          )}
          <Button onClick={addEvent} className="w-full mt-4">
            Submit Event
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SocialActivities;
