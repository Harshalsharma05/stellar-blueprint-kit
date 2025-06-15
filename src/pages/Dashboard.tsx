
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Reports',
      value: '12',
      description: '+2 from last week',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Upcoming Bookings',
      value: '5',
      description: 'Next booking tomorrow',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Events Registered',
      value: '8',
      description: '3 this month',
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Completed Tasks',
      value: '24',
      description: '85% completion rate',
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'Report submitted: Broken Street Light',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'booking',
      title: 'Workspace booking confirmed',
      time: '4 hours ago',
      status: 'confirmed',
    },
    {
      id: 3,
      type: 'event',
      title: 'Registered for Jazz Night',
      time: '1 day ago',
      status: 'registered',
    },
    {
      id: 4,
      type: 'task',
      title: 'Task completed: Review documents',
      time: '2 days ago',
      status: 'completed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': case 'completed': case 'registered': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report': return FileText;
      case 'booking': return Calendar;
      case 'event': return Users;
      case 'task': return CheckCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {user?.role}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(activity.status)}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/reports" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Submit New Report
              </Button>
            </Link>
            <Link to="/bookings" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Make Booking
              </Button>
            </Link>
            <Link to="/events" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Browse Events
              </Button>
            </Link>
            <Link to="/collab" className="block">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Admin Panel Access */}
      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Admin Panel</span>
            </CardTitle>
            <CardDescription>
              Administrative tools and system management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Link to="/admin">
                <Button>
                  Access Admin Panel
                </Button>
              </Link>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
