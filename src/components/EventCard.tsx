import { Heart, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../types/auth';

interface EventCardProps {
  event: Event & { created_by?: { full_name: string; avatar_url: string } };
  isFavorited?: boolean;
  onToggleFavorite?: (eventId: string) => void;
  registrationCount?: number;
}

export default function EventCard({
  event,
  isFavorited = false,
  onToggleFavorite,
  registrationCount = 0,
}: EventCardProps) {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const now = new Date();
  const isUpcoming = startDate > now;

  const categoryColors: Record<string, string> = {
    seminar: 'bg-blue-100 text-blue-800',
    workshop: 'bg-purple-100 text-purple-800',
    conference: 'bg-orange-100 text-orange-800',
    party: 'bg-pink-100 text-pink-800',
    sports: 'bg-green-100 text-green-800',
    tech: 'bg-indigo-100 text-indigo-800',
    gaming: 'bg-red-100 text-red-800',
    academic: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <Link to={`/event/${event.id}`}>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {event.banner_image_url ? (
            <img
              src={event.banner_image_url}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
          )}

          {!isUpcoming && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Ended</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(event.id);
            }}
            className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>

          {event.is_featured && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
              FEATURED
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 line-clamp-2">{event.title}</h3>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'}`}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </span>
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {event.event_type === 'online' ? 'Online' : 'In-Person'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}

            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{registrationCount}/{event.max_attendees} registered</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {event.created_by?.avatar_url && (
                <img
                  src={event.created_by.avatar_url}
                  alt={event.created_by.full_name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-xs text-gray-600">{event.created_by?.full_name}</span>
            </div>

            <div className="font-bold text-gray-900">
              {event.price === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                <span>${event.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
