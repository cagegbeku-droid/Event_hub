import { supabase } from './supabase';
import { Event, EventRegistration, EventComment, EventCategory } from '../types/auth';

export const eventService = {
  async getUpcomingEvents(limit = 20) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        created_by:profiles(full_name, avatar_url)
      `)
      .gte('start_date', now)
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getFeaturedEvents() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        created_by:profiles(full_name, avatar_url)
      `)
      .eq('is_featured', true)
      .gte('start_date', now)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async searchEvents(query: string) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        created_by:profiles(full_name, avatar_url)
      `)
      .gte('start_date', now)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async filterEvents(
    category?: EventCategory,
    eventType?: 'online' | 'in_person',
    isPaid?: boolean,
    startDate?: string,
    endDate?: string
  ) {
    let query = supabase
      .from('events')
      .select(`
        *,
        created_by:profiles(full_name, avatar_url)
      `);

    const now = new Date().toISOString();
    query = query.gte('start_date', now);

    if (category) {
      query = query.eq('category', category);
    }

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    if (isPaid !== undefined) {
      if (isPaid) {
        query = query.gt('price', 0);
      } else {
        query = query.eq('price', 0);
      }
    }

    if (startDate) {
      query = query.gte('start_date', startDate);
    }

    if (endDate) {
      query = query.lte('end_date', endDate);
    }

    const { data, error } = await query.order('start_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        created_by:profiles(id, full_name, avatar_url, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async registerForEvent(eventId: string, userId: string, quantity = 1) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        user_id: userId,
        tickets_quantity: quantity,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRegistration(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateRegistration(id: string, quantity: number) {
    const { data, error } = await supabase
      .from('event_registrations')
      .update({ tickets_quantity: quantity })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async cancelRegistration(eventId: string, userId: string) {
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getEventRegistrations(eventId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        user_id:profiles(full_name, email, avatar_url)
      `)
      .eq('event_id', eventId);

    if (error) throw error;
    return data;
  },

  async getUserRegistrations(userId: string) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        event_id:events(*)
      `)
      .eq('user_id', userId)
      .order('registration_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addComment(eventId: string, userId: string, content: string) {
    const { data, error } = await supabase
      .from('event_comments')
      .insert([{ event_id: eventId, user_id: userId, content }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEventComments(eventId: string) {
    const { data, error } = await supabase
      .from('event_comments')
      .select(`
        *,
        user_id:profiles(full_name, avatar_url)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('event_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  async addFavorite(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('favorite_events')
      .insert([{ event_id: eventId, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavorite(eventId: string, userId: string) {
    const { error } = await supabase
      .from('favorite_events')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async isFavorited(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from('favorite_events')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorite_events')
      .select(`
        *,
        event_id:events(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrganizedEvents(userId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('created_by', userId)
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  },
};
