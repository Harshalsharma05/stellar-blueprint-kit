
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { reportsApi } from '@/lib/api/reports';
import { Report } from '@/types';
import { REPORT_TYPES, REPORT_STATUS } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, FileText, MapPin, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New report form
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    type: '' as Report['type'],
    location: '',
  });

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await reportsApi.getReports(user?.id);
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newReport.title || !newReport.type) return;

    try {
      setIsSubmitting(true);
      const reportData = {
        ...newReport,
        status: 'pending' as const,
        userId: user.id,
      };
      
      const createdReport = await reportsApi.createReport(reportData);
      setReports([createdReport, ...reports]);
      setIsDialogOpen(false);
      setNewReport({ title: '', description: '', type: '' as Report['type'], location: '' });
      toast.success('Report submitted successfully');
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'crime': return 'bg-red-100 text-red-800';
      case 'litter': return 'bg-green-100 text-green-800';
      case 'grievance': return 'bg-blue-100 text-blue-800';
      case 'e_waste': return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
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
            <Skeleton key={i} className="h-32" />
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
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Submit and track your community reports</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit New Report</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new report to your community.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={newReport.type}
                  onValueChange={(value: Report['type']) => setNewReport({ ...newReport, type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={REPORT_TYPES.CRIME}>Crime</SelectItem>
                    <SelectItem value={REPORT_TYPES.LITTER}>Litter</SelectItem>
                    <SelectItem value={REPORT_TYPES.GRIEVANCE}>Grievance</SelectItem>
                    <SelectItem value={REPORT_TYPES.E_WASTE}>E-Waste</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  placeholder="Where did this occur?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  placeholder="Provide detailed information about the issue"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
            placeholder="Search reports..."
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
            <SelectItem value={REPORT_STATUS.PENDING}>Pending</SelectItem>
            <SelectItem value={REPORT_STATUS.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={REPORT_STATUS.RESOLVED}>Resolved</SelectItem>
            <SelectItem value={REPORT_STATUS.REJECTED}>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by submitting your first report'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Submit Report
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getTypeColor(report.type)}>
                        {report.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(report.status)}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(report.status)}
                          <span className="capitalize">{report.status.replace('_', ' ')}</span>
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">
                  {report.description}
                </CardDescription>
                
                {report.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {report.location}
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
