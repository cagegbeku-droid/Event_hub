import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../lib/eventService';
import { Event, EventCategory } from '../types/auth';
import EventCard from '../components/EventCard';

export default function EventDiscovery() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | ''>('');
  const [eventType, setEventType] = useState<'online' | 'in_person' | ''>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, eventType, priceFilter]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const delayDebounceFn = setTimeout(() => {
        searchEvents();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      loadEvents();
    }
  }, [searchQuery]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      let data;

      if (selectedCategory || eventType !== '' || priceFilter !== 'all') {
        data = await eventService.filterEvents(
          selectedCategory || undefined,
          (eventType as 'online' | 'in_person') || undefined,
          priceFilter === 'paid' ? true : priceFilter === 'free' ? false : undefined
        );
      } else {
        data = await eventService.getUpcomingEvents(50);
      }

      setEvents(data || []);

      if (!selectedCategory && eventType === '' && priceFilter === 'all') {
        const featured = await eventService.getFeaturedEvents();
        setFeaturedEvents(featured || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.searchEvents(searchQuery);
      setEvents(data || []);
    } catch (error) {
      console.error('Error searching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (eventId: string) => {
    if (!user) return;

    try {
      if (favorites.has(eventId)) {
        await eventService.removeFavorite(eventId, user.id);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      } else {
        await eventService.addFavorite(eventId, user.id);
        setFavorites(prev => new Set(prev).add(eventId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const categories: EventCategory[] = ['seminar', 'workshop', 'conference', 'party', 'sports', 'tech', 'gaming', 'academic'];

  return (
    <div className="min-h-screen bg-gray-50">
      {featuredEvents.length > 0 && !selectedCategory && eventType === '' && priceFilter === 'all' && !searchQuery && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 2).map(event => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className="group relative overflow-hidden rounded-lg h-64"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
                  {event.banner_image_url && (
                    <img
                      src={event.banner_image_url}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-50"
                    />
                  )}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                    <p className="text-blue-100 text-sm mb-4">{event.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold bg-white text-blue-600 px-3 py-1 rounded-full">
                        {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                      </span>
                      <span className="text-white font-bold">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Campus Events</h1>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as EventCategory | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as 'online' | 'in_person' | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="online">Online</option>
                  <option value="in_person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Events</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setEventType('');
                    setPriceFilter('all');
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No events found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setEventType('');
                setPriceFilter('all');
              }}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Events
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {searchQuery ? 'Search Results' : 'Upcoming Events'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorited={favorites.has(event.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
