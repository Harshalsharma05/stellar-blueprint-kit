
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Document } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, Lock, Search, Shield, Calendar, User, Eye } from 'lucide-react';
import { toast } from 'sonner';

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Mathematics Final Exam - Spring 2024',
    type: 'exam_paper',
    url: '/documents/math_final_2024.pdf',
    isSecure: true,
    accessLevel: ['admin', 'moderator'],
    uploadedBy: 'Prof. Johnson',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Community Safety Certificate',
    type: 'certificate',
    url: '/documents/safety_cert.pdf',
    isSecure: false,
    accessLevel: ['admin', 'moderator', 'user'],
    uploadedBy: 'Admin User',
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Annual Community Report 2023',
    type: 'report',
    url: '/documents/annual_report_2023.pdf',
    isSecure: false,
    accessLevel: ['admin', 'moderator', 'user', 'service_provider'],
    uploadedBy: 'Community Board',
    createdAt: '2024-01-05T09:15:00Z',
  },
  {
    id: '4',
    title: 'Physics Advanced Exam',
    type: 'exam_paper',
    url: '/documents/physics_advanced.pdf',
    isSecure: true,
    accessLevel: ['admin'],
    uploadedBy: 'Dr. Smith',
    createdAt: '2024-01-20T16:45:00Z',
  },
  {
    id: '5',
    title: 'Event Planning Guidelines',
    type: 'report',
    url: '/documents/event_guidelines.pdf',
    isSecure: false,
    accessLevel: ['admin', 'moderator', 'user', 'service_provider'],
    uploadedBy: 'Events Team',
    createdAt: '2024-01-12T11:20:00Z',
  },
];

export default function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [downloadingDocs, setDownloadingDocs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      // Simulate API call with user role filtering
      setTimeout(() => {
        const accessibleDocs = mockDocuments.filter(doc => 
          !user || doc.accessLevel.includes(user.role)
        );
        setDocuments(accessibleDocs);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load documents:', error);
      toast.error('Failed to load documents');
      setIsLoading(false);
    }
  };

  const handleDownload = async (docId: string, title: string, isSecure: boolean) => {
    if (isSecure && user?.role !== 'admin' && user?.role !== 'moderator') {
      toast.error('You do not have permission to download this document');
      return;
    }

    try {
      setDownloadingDocs(prev => new Set(prev).add(docId));
      
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Downloaded: ${title}`);
    } catch (error) {
      console.error('Failed to download document:', error);
      toast.error('Failed to download document');
    } finally {
      setDownloadingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  const handleView = (docId: string, title: string, isSecure: boolean) => {
    if (isSecure && user?.role !== 'admin' && user?.role !== 'moderator') {
      toast.error('You do not have permission to view this document');
      return;
    }

    // In a real app, this would open the document in a secure viewer
    toast.success(`Opening: ${title}`);
  };

  const getTypeColor = (type: Document['type']) => {
    switch (type) {
      case 'exam_paper': return 'bg-red-100 text-red-800';
      case 'certificate': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'exam_paper': return <FileText className="h-4 w-4" />;
      case 'certificate': return <Shield className="h-4 w-4" />;
      case 'report': return <FileText className="h-4 w-4" />;
    }
  };

  const hasAccess = (doc: Document) => {
    return user && doc.accessLevel.includes(user.role);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Documents</h1>
        <p className="text-muted-foreground">Access and download authorized documents</p>
      </div>

      {/* Access Level Info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You have <strong>{user?.role}</strong> level access. Some documents may be restricted based on your role.
        </AlertDescription>
      </Alert>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{documents.length}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-semibold">
                  {documents.filter(doc => doc.isSecure).length}
                </div>
                <div className="text-sm text-muted-foreground">Secure Documents</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">
                  {documents.filter(doc => doc.type === 'certificate').length}
                </div>
                <div className="text-sm text-muted-foreground">Certificates</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold">
                  {documents.filter(doc => doc.type === 'exam_paper').length}
                </div>
                <div className="text-sm text-muted-foreground">Exam Papers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search documents..."
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
            <SelectItem value="exam_paper">Exam Papers</SelectItem>
            <SelectItem value="certificate">Certificates</SelectItem>
            <SelectItem value="report">Reports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No documents are available for your access level'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((document) => {
            const canAccess = hasAccess(document);
            const isDownloading = downloadingDocs.has(document.id);
            
            return (
              <Card key={document.id} className={`hover:shadow-md transition-shadow ${!canAccess ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        {getTypeIcon(document.type)}
                        <span>{document.title}</span>
                        {document.isSecure && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getTypeColor(document.type)}>
                          {document.type.replace('_', ' ')}
                        </Badge>
                        {document.isSecure && (
                          <Badge variant="outline" className="text-red-600 border-red-200">
                            <Lock className="h-3 w-3 mr-1" />
                            Secure
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(document.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        Uploaded by {document.uploadedBy}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(document.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(document.id, document.title, document.isSecure)}
                        disabled={!canAccess}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(document.id, document.title, document.isSecure)}
                        disabled={!canAccess || isDownloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? 'Downloading...' : 'Download'}
                      </Button>
                    </div>
                  </div>
                  
                  {!canAccess && (
                    <Alert className="mt-3">
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        You don't have permission to access this document. Required access level: {document.accessLevel.join(', ')}
                      </AlertDescription>
                    </Alert>
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
