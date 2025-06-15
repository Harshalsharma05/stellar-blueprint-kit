
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authService } from '@/lib/auth';
import { Loader2, Chrome, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setError('Authentication failed. Please try again.');
      return;
    }

    if (code) {
      handleOAuthCallback(code);
    }
  }, []);

  const handleOAuthCallback = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await authService.exchangeCodeForToken(code);
      await login(token);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError('Failed to complete authentication. Please try again.');
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setError(null);
    
    // In a real app, this would redirect to Google OAuth
    const googleAuthUrl = authService.getGoogleAuthUrl();
    
    // For demo purposes, we'll simulate the OAuth flow
    setTimeout(async () => {
      try {
        const mockToken = 'mock_token_' + Date.now();
        await login(mockToken);
        navigate(from, { replace: true });
      } catch (err) {
        setError('Login failed. Please try again.');
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing you in...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5" />
                  Continue with Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            {/* Demo login buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(async () => {
                    try {
                      const mockToken = 'admin_token_' + Date.now();
                      await login(mockToken);
                      // Mock admin user
                      const adminUser = {
                        id: '1',
                        email: 'admin@example.com',
                        name: 'Admin User',
                        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
                        role: 'admin' as const,
                        createdAt: new Date().toISOString(),
                        isActive: true,
                      };
                      navigate(from, { replace: true });
                    } catch (err) {
                      setError('Login failed. Please try again.');
                    } finally {
                      setIsLoading(false);
                    }
                  }, 1000);
                }}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                Demo Login (Admin)
              </Button>
              
              <Button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(async () => {
                    try {
                      const mockToken = 'user_token_' + Date.now();
                      await login(mockToken);
                      navigate(from, { replace: true });
                    } catch (err) {
                      setError('Login failed. Please try again.');
                    } finally {
                      setIsLoading(false);
                    }
                  }, 1000);
                }}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                Demo Login (User)
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" className="p-0 h-auto font-normal">
              Contact your administrator
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
