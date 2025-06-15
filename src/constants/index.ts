
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  MODERATOR: 'moderator' as const,
  USER: 'user' as const,
  SERVICE_PROVIDER: 'service_provider' as const,
};

export const REPORT_TYPES = {
  CRIME: 'crime' as const,
  LITTER: 'litter' as const,
  GRIEVANCE: 'grievance' as const,
  E_WASTE: 'e_waste' as const,
};

export const REPORT_STATUS = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in_progress' as const,
  RESOLVED: 'resolved' as const,
  REJECTED: 'rejected' as const,
};

export const BOOKING_TYPES = {
  BED_ROLL: 'bed_roll' as const,
  WORKSPACE: 'workspace' as const,
  PET_SERVICE: 'pet_service' as const,
};

export const EVENT_TYPES = {
  MUSIC: 'music' as const,
  WORKSHOP: 'workshop' as const,
  CONFERENCE: 'conference' as const,
  SOCIAL: 'social' as const,
};

export const RECOMMENDATION_TYPES = {
  DIET: 'diet' as const,
  LEARNING: 'learning' as const,
  FITNESS: 'fitness' as const,
};

export const TASK_STATUS = {
  TODO: 'todo' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
};

export const PRIORITY_LEVELS = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
};

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USER: '/api/user',
  REPORTS: '/api/reports',
  BOOKINGS: '/api/bookings',
  EVENTS: '/api/events',
  RECOMMENDATIONS: '/api/recommendations',
  TASKS: '/api/tasks',
  DOCUMENTS: '/api/documents',
};

export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:8080/auth/callback',
};
