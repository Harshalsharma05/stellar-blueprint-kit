
import { useState, useEffect } from 'react';
import { eventsApi } from '@/lib/api/events';
import { Event } from '@/types';
import { EVENT_TYPES } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, DollarSign, Search, Music, BookOpen, Briefcase, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [registeringEvents, setRegisteringEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsApi.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      setRegisteringEvents(prev => new Set(prev).add(eventId));
      await eventsApi.registerForEvent(eventId, 'user_id');
      setRegisteredEvents(prev => new Set(prev).add(eventId));
      
      // Update event in the list
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, registeredCount: event.registeredCount + 1 }
          : event
      ));
      
      toast.success('Successfully registered for event!');
    } catch (error: any) {
      console.error('Failed to register for event:', error);
      toast.error(error.message || 'Failed to register for event');
    } finally {
      setRegisteringEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      setRegisteringEvents(prev => new Set(prev).add(eventId));
      await eventsApi.unregisterFromEvent(eventId, 'user_id');
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      // Update event in the list
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, registeredCount: Math.max(0, event.registeredCount - 1) }
          : event
      ));
      
      toast.success('Successfully unregistered from event');
    } catch (error: any) {
      console.error('Failed to unregister from event:', error);
      toast.error(error.message || 'Failed to unregister from event');
    } finally {
      setRegisteringEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const getTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'music': return <Music className="h-4 w-4" />;
      case 'workshop': return <BookOpen className="h-4 w-4" />;
      case 'conference': return <Briefcase className="h-4 w-4" />;
      case 'social': return <Heart className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'music': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'conference': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-pink-100 text-pink-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">Discover and register for community events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value={EVENT_TYPES.MUSIC}>Music</SelectItem>
            <SelectItem value={EVENT_TYPES.WORKSHOP}>Workshop</SelectItem>
            <SelectItem value={EVENT_TYPES.CONFERENCE}>Conference</SelectItem>
            <SelectItem value={EVENT_TYPES.SOCIAL}>Social</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back later for new events'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const isRegistered = registeredEvents.has(event.id);
            const isRegistering = registeringEvents.has(event.id);
            const isFull = event.registeredCount >= event.capacity;
            
            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {event.image && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className={getTypeColor(event.type)}>
                        <span className="flex items-center space-x-1">
                          {getTypeIcon(event.type)}
                          <span className="capitalize">{event.type}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="text-sm">
                        by {event.organizer}
                      </CardDescription>
                    </div>
                    {event.price > 0 && (
                      <div className="text-right">
                        <div className="text-lg font-bold">${event.price}</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {new Date(event.date).toLocaleDateString()} at{' '}
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {event.registeredCount} / {event.capacity} registered
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    {isRegistered ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleUnregister(event.id)}
                        disabled={isRegistering}
                      >
                        {isRegistering ? 'Processing...' : 'Unregister'}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleRegister(event.id)}
                        disabled={isRegistering || isFull}
                      >
                        {isRegistering ? 'Registering...' : isFull ? 'Event Full' : 'Register'}
                      </Button>
                    )}
                  </div>
                  
                  {event.price === 0 && (
                    <Badge variant="secondary" className="w-fit">
                      Free Event
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
