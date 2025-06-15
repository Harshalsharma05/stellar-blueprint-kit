
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  FileText,
  Calendar,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Lightbulb,
  FileCheck,
  Shield,
  CheckSquare,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Events', href: '/events', icon: Users },
    { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
    { name: 'Collaboration', href: '/collab', icon: CheckSquare },
    { name: 'Documents', href: '/documents', icon: FileCheck },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Shield },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div
      className={cn(
        'flex flex-col bg-card border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-lg">MERN App</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive(item.href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <item.icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}

          {user?.role === 'admin' && (
            <>
              <Separator className="my-4" />
              {adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', !collapsed && 'mr-3')} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </>
          )}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="border-t p-4">
        {!collapsed && user && (
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <Link
            to="/profile"
            className={cn(
              'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <Settings className={cn('h-4 w-4', !collapsed && 'mr-3')} />
            {!collapsed && <span>Settings</span>}
          </Link>
          
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              'w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut className={cn('h-4 w-4', !collapsed && 'mr-3')} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
