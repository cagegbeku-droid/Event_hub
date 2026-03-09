import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../lib/eventService';
import EventCard from '../components/EventCard';

export default function MyEvents() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [organizedEvents, setOrganizedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'registered' | 'organized'>('registered');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadEvents();
  }, [user, navigate]);

  const loadEvents = async () => {
    if (!user) return;
    try {
      setLoading(true);

      const regs = await eventService.getUserRegistrations(user.id);
      const registeredEventData = regs?.map(r => r.event_id) || [];
      setRegisteredEvents(registeredEventData);

      if (profile?.role === 'organizer' || profile?.role === 'admin') {
        const organized = await eventService.getOrganizedEvents(user.id);
        setOrganizedEvents(organized || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-2">Manage your event registrations and organized events</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setTab('registered')}
            className={`px-6 py-4 font-semibold transition-colors ${
              tab === 'registered'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registered Events ({registeredEvents.length})
          </button>

          {(profile?.role === 'organizer' || profile?.role === 'admin') && (
            <button
              onClick={() => setTab('organized')}
              className={`px-6 py-4 font-semibold transition-colors ${
                tab === 'organized'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Organized Events ({organizedEvents.length})
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading events...</div>
        ) : tab === 'registered' ? (
          <div>
            {registeredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">You haven't registered for any events yet</p>
                <Link
                  to="/events"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {organizedEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">You haven't organized any events yet</p>
                <Link
                  to="/create-event"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Event
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
