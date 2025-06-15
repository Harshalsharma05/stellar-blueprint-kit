
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Report, Booking, Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  Settings, 
  Search, 
  Shield, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true,
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'moderator',
    createdAt: '2024-01-10T14:30:00Z',
    isActive: true,
  },
  {
    id: '3',
    email: 'service@provider.com',
    name: 'Service Provider Co.',
    role: 'service_provider',
    createdAt: '2024-01-05T09:15:00Z',
    isActive: false,
  },
];

const mockStats = {
  totalUsers: 1250,
  activeReports: 45,
  pendingBookings: 23,
  upcomingEvents: 8,
  monthlyGrowth: 12.5,
  systemHealth: 99.2,
};

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin data');
      setIsLoading(false);
    }
  };

  const handleUserStatusChange = (userId: string, isActive: boolean) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isActive } : u
    ));
    toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
  };

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast.success('User role updated successfully');
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'service_provider': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-green-100 text-green-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">System administration and user management</p>
        </div>
        <Badge variant="outline" className="text-red-600 border-red-200">
          <Shield className="h-4 w-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+{mockStats.monthlyGrowth}%</span>
              <span className="text-muted-foreground ml-2">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockStats.activeReports}</div>
                <div className="text-sm text-muted-foreground">Active Reports</div>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <AlertCircle className="h-4 w-4 text-orange-600 mr-1" />
              <span className="text-muted-foreground">Needs attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockStats.pendingBookings}</div>
                <div className="text-sm text-muted-foreground">Pending Bookings</div>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-muted-foreground">Processing</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{mockStats.systemHealth}%</div>
                <div className="text-sm text-muted-foreground">System Health</div>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="service_provider">Service Provider</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="space-y-3">
                {filteredUsers.map((userItem) => (
                  <Card key={userItem.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userItem.name}`}
                          alt={userItem.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{userItem.name}</div>
                          <div className="text-sm text-muted-foreground">{userItem.email}</div>
                          <div className="text-xs text-muted-foreground">
                            Joined {new Date(userItem.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className={getRoleColor(userItem.role)}>
                          {userItem.role.replace('_', ' ')}
                        </Badge>
                        
                        <Badge variant={userItem.isActive ? 'default' : 'secondary'}>
                          {userItem.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Select
                            value={userItem.role}
                            onValueChange={(value: User['role']) => handleRoleChange(userItem.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="service_provider">Service Provider</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant={userItem.isActive ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleUserStatusChange(userItem.id, !userItem.isActive)}
                          >
                            {userItem.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Management</CardTitle>
              <CardDescription>
                Review and manage user-submitted reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Report Management</h3>
                <p className="text-muted-foreground">
                  Advanced report management features would be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>
                Monitor system performance and user engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Comprehensive analytics and reporting tools would be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">System Configuration</h3>
                <p className="text-muted-foreground">
                  System configuration options would be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
