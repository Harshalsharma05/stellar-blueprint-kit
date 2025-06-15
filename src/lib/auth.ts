
import { User } from '@/types';

export class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    // Simulate API call to backend to exchange code for JWT token
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('mock_jwt_token_' + Date.now());
      }, 1000);
    });
  }

  async getUserFromToken(token: string): Promise<User> {
    // Simulate API call to get user data from JWT token
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          role: 'user',
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        resolve(mockUser);
      }, 500);
    });
  }

  getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'mock_client_id',
      redirect_uri: window.location.origin + '/auth/callback',
      response_type: 'code',
      scope: 'email profile openid',
      access_type: 'offline',
      prompt: 'consent',
    });
    
    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  }
}

export const authService = AuthService.getInstance();
