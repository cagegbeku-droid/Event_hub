import { User } from '@supabase/supabase-js';

export type UserRole = 'student' | 'organizer' | 'admin';
export type EventType = 'online' | 'in_person';
export type EventCategory = 'seminar' | 'workshop' | 'conference' | 'party' | 'sports' | 'tech' | 'gaming' | 'academic';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  university_email: string | null;
  university_verified: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  created_by: string;
  title: string;
  description: string;
  category: EventCategory;
  event_type: EventType;
  location: string | null;
  start_date: string;
  end_date: string;
  banner_image_url: string | null;
  price: number;
  max_attendees: number | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  tickets_quantity: number;
  registration_date: string;
  status: string;
}

export interface EventComment {
  id: string;
  event_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface FavoriteEvent {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
