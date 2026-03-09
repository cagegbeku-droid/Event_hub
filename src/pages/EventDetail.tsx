import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Heart, Share2, MessageCircle, CreditCard as Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { eventService } from '../lib/eventService';
import { Event } from '../types/auth';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [registrations, setRegistrations] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);

      const regsData = await eventService.getEventRegistrations(id);
      setRegistrationCount(regsData?.length || 0);

      const commentsData = await eventService.getEventComments(id);
      setComments(commentsData || []);

      if (user) {
        const fav = await eventService.isFavorited(id, user.id);
        setIsFavorited(fav);

        const reg = await eventService.getRegistration(id, user.id);
        if (reg) {
          setIsRegistered(true);
          setTicketQuantity(reg.tickets_quantity);
        }
      }
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user || !event) return;

    try {
      if (isRegistered) {
        await eventService.cancelRegistration(event.id, user.id);
        setIsRegistered(false);
        setTicketQuantity(1);
        setRegistrationCount(prev => prev - 1);
      } else {
        if (event.max_attendees && registrationCount >= event.max_attendees) {
          alert('This event is fully booked.');
          return;
        }
        await eventService.registerForEvent(event.id, user.id, ticketQuantity);
        setIsRegistered(true);
        setRegistrationCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error updating registration');
    }
  };

  const handleAddComment = async () => {
    if (!user || !event || !newComment.trim()) return;

    try {
      const comment = await eventService.addComment(event.id, user.id, newComment);
      setComments([{ ...comment, user_id: { full_name: profile?.full_name, avatar_url: profile?.avatar_url } }, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await eventService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user || !event) return;

    try {
      if (isFavorited) {
        await eventService.removeFavorite(event.id, user.id);
      } else {
        await eventService.addFavorite(event.id, user.id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(event.id);
      navigate('/my-events');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isEventCreator = user?.id === event.created_by;
  const isEventPast = new Date(event.end_date) < new Date();
  const spotsAvailable = event.max_attendees ? event.max_attendees - registrationCount : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/events')}
          className="text-blue-600 hover:text-blue-700 mb-6"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-6">
          <div className="relative h-96 bg-gray-200">
            {event.banner_image_url ? (
              <img
                src={event.banner_image_url}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
            )}

            {isEventPast && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Event Ended</span>
              </div>
            )}

            {isEventCreator && (
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => navigate(`/event/${event.id}/edit`)}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded mb-2">
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  {event.created_by && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Organized by: {event.created_by}</span>
                    </div>
                  )}
                </div>
              </div>

              {user && (
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>
              )}
            </div>

            <div className="space-y-4 mb-6 py-6 border-y border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold">{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {event.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.event_type === 'online' && (
                <div className="flex items-center gap-3 text-gray-700">
                  <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded">
                    Online Event
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-5 h-5 text-blue-600" />
                <span>
                  {registrationCount} {registrationCount === 1 ? 'person' : 'people'} registered
                  {spotsAvailable !== null && ` • ${spotsAvailable} spots available`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-wrap mb-6">{event.description}</p>

                {user && !isEventCreator && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    {isEventPast ? (
                      <p className="text-gray-600">This event has ended.</p>
                    ) : (
                      <div className="space-y-4">
                        {event.max_attendees && spotsAvailable !== null && spotsAvailable <= 0 ? (
                          <p className="text-red-600 font-semibold">This event is fully booked.</p>
                        ) : (
                          <>
                            {!isRegistered && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                                <div className="flex items-center gap-2 mb-4">
                                  <button
                                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                  >
                                    −
                                  </button>
                                  <span className="px-4 font-semibold">{ticketQuantity}</span>
                                  <button
                                    onClick={() => setTicketQuantity(ticketQuantity + 1)}
                                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={handleRegister}
                              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                                isRegistered
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isRegistered ? 'Cancel Registration' : 'Register Now'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-8">
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-2">Price</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                    </p>
                  </div>

                  {user && !isEventCreator && !isEventPast && (
                    <div className="space-y-3">
                      <button
                        onClick={handleToggleFavorite}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        {isFavorited ? 'Favorited' : 'Add to Favorites'}
                      </button>
                      <button
                        onClick={() => {
                          const url = `${window.location.href}`;
                          navigator.clipboard.writeText(url);
                          alert('Event link copied to clipboard!');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Discussion
                </h2>

                {!isEventPast && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts about this event..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Post Comment
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {comment.user_id?.avatar_url && (
                              <img
                                src={comment.user_id.avatar_url}
                                alt={comment.user_id.full_name}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{comment.user_id?.full_name}</p>
                              <p className="text-xs text-gray-600">{new Date(comment.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          {user?.id === comment.user_id && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
