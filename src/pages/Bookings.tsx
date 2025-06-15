
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsApi } from '@/lib/api/bookings';
import { Booking } from '@/types';
import { BOOKING_TYPES } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, DollarSign, Plus, Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newBooking, setNewBooking] = useState({
    title: '',
    type: '' as Booking['type'],
    startDate: '',
    endDate: '',
    location: '',
    price: 0,
  });

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingsApi.getBookings(user?.id);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBooking.title || !newBooking.type) return;

    try {
      setIsSubmitting(true);
      const bookingData = {
        ...newBooking,
        status: 'pending' as const,
        userId: user.id,
      };
      
      const createdBooking = await bookingsApi.createBooking(bookingData);
      setBookings([createdBooking, ...bookings]);
      setIsDialogOpen(false);
      setNewBooking({
        title: '',
        type: '' as Booking['type'],
        startDate: '',
        endDate: '',
        location: '',
        price: 0,
      });
      toast.success('Booking request submitted successfully');
    } catch (error) {
      console.error('Failed to submit booking:', error);
      toast.error('Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingsApi.cancelBooking(id);
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      ));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type: Booking['type']) => {
    switch (type) {
      case 'workspace': return 'bg-blue-100 text-blue-800';
      case 'bed_roll': return 'bg-green-100 text-green-800';
      case 'pet_service': return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage your service bookings and reservations</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>
                Fill out the form below to request a new booking.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={newBooking.title}
                  onChange={(e) => setNewBooking({ ...newBooking, title: e.target.value })}
                  placeholder="e.g., Coworking Space - Downtown"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Service Type *</Label>
                <Select
                  value={newBooking.type}
                  onValueChange={(value: Booking['type']) => setNewBooking({ ...newBooking, type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BOOKING_TYPES.WORKSPACE}>Workspace</SelectItem>
                    <SelectItem value={BOOKING_TYPES.BED_ROLL}>Bed Roll</SelectItem>
                    <SelectItem value={BOOKING_TYPES.PET_SERVICE}>Pet Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={newBooking.startDate}
                    onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newBooking.endDate}
                    onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newBooking.location}
                  onChange={(e) => setNewBooking({ ...newBooking, location: e.target.value })}
                  placeholder="Service location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Expected Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newBooking.price}
                  onChange={(e) => setNewBooking({ ...newBooking, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first booking'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Booking
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{booking.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getTypeColor(booking.type)}>
                        {booking.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(booking.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  {booking.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{booking.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">${booking.price}</span>
                  </div>
                </div>
                
                {booking.status === 'confirmed' && (
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel Booking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
