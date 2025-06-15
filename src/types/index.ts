
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

export type UserRole = 'admin' | 'moderator' | 'user' | 'service_provider';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'crime' | 'litter' | 'grievance' | 'e_waste';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  location: string;
  images?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  title: string;
  type: 'bed_roll' | 'workspace' | 'pet_service';
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  location: string;
  userId: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'music' | 'workshop' | 'conference' | 'social';
  date: string;
  location: string;
  capacity: number;
  registeredCount: number;
  price: number;
  image?: string;
  organizer: string;
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'diet' | 'learning' | 'fitness';
  description: string;
  plan: string[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
}

export interface Document {
  id: string;
  title: string;
  type: 'exam_paper' | 'certificate' | 'report';
  url: string;
  isSecure: boolean;
  accessLevel: UserRole[];
  uploadedBy: string;
  createdAt: string;
}
