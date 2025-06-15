
import { Report } from '@/types';

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Broken Street Light',
    description: 'Street light on Main St has been out for 3 days',
    type: 'grievance',
    status: 'pending',
    location: 'Main Street, Downtown',
    userId: '1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Illegal Dumping',
    description: 'Large pile of garbage dumped near the park',
    type: 'litter',
    status: 'in_progress',
    location: 'Central Park Area',
    userId: '1',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
];

export const reportsApi = {
  getReports: async (userId?: string): Promise<Report[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredReports = userId 
          ? mockReports.filter(report => report.userId === userId)
          : mockReports;
        resolve(filteredReports);
      }, 800);
    });
  },

  getReport: async (id: string): Promise<Report | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = mockReports.find(r => r.id === id) || null;
        resolve(report);
      }, 500);
    });
  },

  createReport: async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport: Report = {
          ...reportData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockReports.push(newReport);
        resolve(newReport);
      }, 1000);
    });
  },

  updateReport: async (id: string, updates: Partial<Report>): Promise<Report> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockReports.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Report not found'));
          return;
        }
        
        mockReports[index] = {
          ...mockReports[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(mockReports[index]);
      }, 600);
    });
  },

  deleteReport: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockReports.findIndex(r => r.id === id);
        if (index === -1) {
          reject(new Error('Report not found'));
          return;
        }
        mockReports.splice(index, 1);
        resolve();
      }, 500);
    });
  },
};
