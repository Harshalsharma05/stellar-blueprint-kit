
import { Booking } from '@/types';

const mockBookings: Booking[] = [
  {
    id: '1',
    title: 'Coworking Space - Downtown',
    type: 'workspace',
    startDate: '2024-01-20T09:00:00Z',
    endDate: '2024-01-20T17:00:00Z',
    status: 'confirmed',
    price: 50,
    location: 'Downtown Business Center',
    userId: '1',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Pet Grooming Service',
    type: 'pet_service',
    startDate: '2024-01-22T14:00:00Z',
    endDate: '2024-01-22T16:00:00Z',
    status: 'pending',
    price: 75,
    location: 'Pet Care Center',
    userId: '1',
    createdAt: '2024-01-16T12:15:00Z',
  },
];

export const bookingsApi = {
  getBookings: async (userId?: string): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredBookings = userId 
          ? mockBookings.filter(booking => booking.userId === userId)
          : mockBookings;
        resolve(filteredBookings);
      }, 700);
    });
  },

  getBooking: async (id: string): Promise<Booking | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = mockBookings.find(b => b.id === id) || null;
        resolve(booking);
      }, 400);
    });
  },

  createBooking: async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBooking: Booking = {
          ...bookingData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        mockBookings.push(newBooking);
        resolve(newBooking);
      }, 1200);
    });
  },

  updateBooking: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBookings.findIndex(b => b.id === id);
        if (index === -1) {
          reject(new Error('Booking not found'));
          return;
        }
        
        mockBookings[index] = { ...mockBookings[index], ...updates };
        resolve(mockBookings[index]);
      }, 600);
    });
  },

  cancelBooking: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBookings.findIndex(b => b.id === id);
        if (index === -1) {
          reject(new Error('Booking not found'));
          return;
        }
        mockBookings[index].status = 'cancelled';
        resolve();
      }, 500);
    });
  },
};
