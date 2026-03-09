import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="hidden sm:inline font-bold text-gray-900">EventHub</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                Events
              </Link>
              {user && (profile?.role === 'organizer' || profile?.role === 'admin') && (
                <Link to="/create-event" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Create Event
                </Link>
              )}
              {user && (
                <Link to="/my-events" className="text-gray-700 hover:text-blue-600 transition-colors">
                  My Events
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2">
                  {profile?.avatar_url && (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Profile'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-gray-700">{profile?.full_name}</span>
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Home
            </Link>
            <Link to="/events" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Events
            </Link>
            {user && (profile?.role === 'organizer' || profile?.role === 'admin') && (
              <Link to="/create-event" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Create Event
              </Link>
            )}
            {user && (
              <Link to="/my-events" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                My Events
              </Link>
            )}
            <hr className="my-2" />
            {user ? (
              <>
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="block px-4 py-2 bg-blue-600 text-white rounded-lg">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
