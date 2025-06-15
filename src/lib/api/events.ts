
import { Event } from '@/types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Jazz Night at the Park',
    description: 'An evening of smooth jazz music under the stars',
    type: 'music',
    date: '2024-01-25T19:00:00Z',
    location: 'Central Park Amphitheater',
    capacity: 200,
    registeredCount: 87,
    price: 25,
    organizer: 'City Events',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  },
  {
    id: '2',
    title: 'React Development Workshop',
    description: 'Learn modern React development with hooks and context',
    type: 'workshop',
    date: '2024-01-28T10:00:00Z',
    location: 'Tech Hub Conference Room',
    capacity: 50,
    registeredCount: 32,
    price: 75,
    organizer: 'TechEd Academy',
    image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
  },
  {
    id: '3',
    title: 'Community Social Mixer',
    description: 'Meet new people and build connections in your neighborhood',
    type: 'social',
    date: '2024-01-30T18:00:00Z',
    location: 'Community Center Hall',
    capacity: 100,
    registeredCount: 45,
    price: 0,
    organizer: 'Community Board',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
  },
];

export const eventsApi = {
  getEvents: async (): Promise<Event[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents);
      }, 600);
    });
  },

  getEvent: async (id: string): Promise<Event | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === id) || null;
        resolve(event);
      }, 400);
    });
  },

  registerForEvent: async (eventId: string, userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === eventId);
        if (!event) {
          reject(new Error('Event not found'));
          return;
        }
        
        if (event.registeredCount >= event.capacity) {
          reject(new Error('Event is full'));
          return;
        }
        
        event.registeredCount += 1;
        resolve();
      }, 800);
    });
  },

  unregisterFromEvent: async (eventId: string, userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find(e => e.id === eventId);
        if (!event) {
          reject(new Error('Event not found'));
          return;
        }
        
        if (event.registeredCount > 0) {
          event.registeredCount -= 1;
        }
        resolve();
      }, 600);
    });
  },
};
