import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../lib/eventService';
import EventCard from '../components/EventCard';

export default function Home() {
  const { user, profile } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(false);
      const data = await eventService.getUpcomingEvents(6);
      setUpcomingEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Campus Events
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Connect with student clubs, attend seminars, find workshops, and never miss campus life activities again.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Events
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              {user && (profile?.role === 'organizer' || profile?.role === 'admin') ? (
                <Link
                  to="/create-event"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors border-2 border-white"
                >
                  Create Event
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors border-2 border-white"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose EventHub?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discover Events</h3>
              <p className="text-gray-600">
                Browse and search for campus events across all categories. Filter by type, price, and date to find what interests you.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect & Engage</h3>
              <p className="text-gray-600">
                Register for events, bookmark favorites, and interact with other students in event discussions and comments.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Organize Events</h3>
              <p className="text-gray-600">
                Create and manage events as a club organizer. Track registrations, manage attendees, and grow your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Campus Events</h2>
                <p className="text-gray-600 mt-2">Don't miss these amazing opportunities on campus</p>
              </div>
              <Link
                to="/events"
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-600">Loading events...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Campus Life?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Sign up now to get personalized event recommendations and never miss out on what's happening on campus.
          </p>

          {!user ? (
            <Link
              to="/auth"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
          ) : (
            <Link
              to="/events"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Events
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">EventHub</h3>
              <p className="text-sm text-gray-400">
                Connecting students and campus communities through unforgettable events.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-white transition-colors">
                    Browse Events
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link to="/my-events" className="hover:text-white transition-colors">
                      My Events
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/guidelines" className="hover:text-white transition-colors">
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@eventhub.com" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 EventHub. All rights reserved. Created for campus communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
