import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Bell, AlertTriangle, User, Phone, Mail, Plus, X, Edit, Trash2, MapPin
} from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AuthContext from '../context/AuthContext';

interface EmergencyContact {
  _id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface EmergencyContactFormData {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

const EmergencyContacts: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register, handleSubmit, reset, setValue, formState: { errors }
  } = useForm<EmergencyContactFormData>();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/sos/contacts');
      setContacts(res.data.emergencyContacts);
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSOS = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      setUserLocation(location);

      try {
        await axios.post('/sos/alert', { location });
        toast.success('SOS alert sent successfully!');
      } catch {
        toast.error('Failed to send SOS alert');
      }
    }, () => {
      toast.error('Unable to fetch location');
    });
  };

  const submitForm = async (data: EmergencyContactFormData) => {
    try {
      let res;
      if (editingId) {
        res = await axios.put(`/sos/contacts/${editingId}`, data);
        toast.success('Contact updated');
      } else {
        res = await axios.post('/sos/contacts', data);
        toast.success('Contact added');
      }
      setContacts(res.data.emergencyContacts);
      reset();
      setIsAdding(false);
      setEditingId(null);
    } catch {
      toast.error('Failed to save contact');
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setIsAdding(true);
    setEditingId(contact._id);
    setValue('name', contact.name);
    setValue('relationship', contact.relationship);
    setValue('phone', contact.phone);
    setValue('email', contact.email);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/sos/contacts/${id}`);
      setContacts(res.data.emergencyContacts);
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-right" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Emergency Contacts</h1>
          <p className="text-gray-600 mt-2">Manage contacts and use the SOS alert below.</p>
        </div>

        {/* SOS Section */}
        <Card className="mb-8 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1 mb-4 sm:mb-0">
              <h2 className="text-xl font-bold text-red-600 flex items-center">
                <AlertTriangle className="mr-2" /> SOS Alert
              </h2>
              <p className="text-gray-700 mt-2">
                Click to send your current location to your emergency contacts.
              </p>
              {userLocation && (
                <p className="mt-2 text-blue-700 text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
            <Button variant="danger" size="lg" onClick={handleSOS} disabled={!contacts.length}>
              <Bell className="mr-2" /> Send SOS
            </Button>
          </div>
        </Card>

        {/* Contact List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Contacts</h2>
            <Button onClick={() => { setIsAdding(true); setEditingId(null); reset(); }}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
          {contacts.map(contact => (
            <Card key={contact._id} className="mb-3 p-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{contact.name}</h3>
                <p className="text-gray-600">{contact.relationship}</p>
                <p className="text-sm">{contact.phone}</p>
                <p className="text-sm">{contact.email}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(contact)}><Edit className="h-4 w-4" /></Button>
                <Button variant="danger" onClick={() => handleDelete(contact._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Contact' : 'New Contact'}</h2>
            <form onSubmit={handleSubmit(submitForm)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Name</label>
                <input {...register('name', { required: true })} className="input" />
                {errors.name && <p className="text-red-500 text-sm">Required</p>}
              </div>
              <div>
                <label>Relationship</label>
                <input {...register('relationship', { required: true })} className="input" />
              </div>
              <div>
                <label>Phone</label>
                <input {...register('phone', { required: true })} className="input" />
              </div>
              <div>
                <label>Email</label>
                <input {...register('email', { required: true })} className="input" />
              </div>
              <div className="col-span-2 flex gap-2 justify-end">
                <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
                <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EmergencyContacts;
