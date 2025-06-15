
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types';
import { TASK_STATUS, PRIORITY_LEVELS } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, CheckSquare, Clock, AlertCircle, User, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the community platform',
    status: 'in_progress',
    assignedTo: 'John Doe',
    dueDate: '2024-01-25T17:00:00Z',
    priority: 'high',
    projectId: 'project_1',
  },
  {
    id: '2',
    title: 'Update user documentation',
    description: 'Revise the user guide with new features and screenshots',
    status: 'todo',
    assignedTo: 'Jane Smith',
    dueDate: '2024-01-28T12:00:00Z',
    priority: 'medium',
    projectId: 'project_1',
  },
  {
    id: '3',
    title: 'Fix mobile responsiveness',
    description: 'Address mobile layout issues on the reports page',
    status: 'completed',
    assignedTo: 'Mike Johnson',
    dueDate: '2024-01-20T15:00:00Z',
    priority: 'high',
    projectId: 'project_2',
  },
  {
    id: '4',
    title: 'Implement dark mode',
    description: 'Add dark mode support across all pages',
    status: 'todo',
    assignedTo: 'Sarah Wilson',
    dueDate: '2024-02-01T10:00:00Z',
    priority: 'low',
    projectId: 'project_2',
  },
];

export default function Collaboration() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTasks(mockTasks);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      setIsSubmitting(true);
      const taskData: Task = {
        ...newTask,
        id: Date.now().toString(),
        status: 'todo',
        projectId: 'project_1',
      };
      
      setTasks([taskData, ...tasks]);
      setIsDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
      });
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast.success('Task status updated');
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-24" />
              {[1, 2].map((j) => (
                <Skeleton key={j} className="h-32" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <Badge variant="secondary" className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-sm">
          {task.description}
        </CardDescription>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            {task.assignedTo}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {task.status === 'todo' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(task.id, 'in_progress')}
            >
              Start
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button
              size="sm"
              onClick={() => handleStatusChange(task.id, 'completed')}
            >
              Complete
            </Button>
          )}
          {task.status === 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange(task.id, 'todo')}
            >
              Reopen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collaboration</h1>
          <p className="text-muted-foreground">Manage tasks and collaborate with your team</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to the project board.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe the task"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="Team member name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PRIORITY_LEVELS.LOW}>Low</SelectItem>
                      <SelectItem value={PRIORITY_LEVELS.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={PRIORITY_LEVELS.HIGH}>High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold">{todoTasks.length}</div>
                <div className="text-sm text-muted-foreground">To Do</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{inProgressTasks.length}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">{completedTasks.length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Filter className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold">{tasks.length}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
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
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={TASK_STATUS.TODO}>To Do</SelectItem>
            <SelectItem value={TASK_STATUS.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TASK_STATUS.COMPLETED}>Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value={PRIORITY_LEVELS.LOW}>Low</SelectItem>
            <SelectItem value={PRIORITY_LEVELS.MEDIUM}>Medium</SelectItem>
            <SelectItem value={PRIORITY_LEVELS.HIGH}>High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Board */}
      <Tabs defaultValue="board" className="space-y-4">
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="board" className="space-y-0">
          <div className="grid gap-6 md:grid-cols-3">
            {/* To Do Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getStatusColor('todo')}>
                  <Clock className="h-4 w-4 mr-1" />
                  To Do ({todoTasks.length})
                </Badge>
              </div>
              <div className="space-y-3">
                {todoTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getStatusColor('in_progress')}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  In Progress ({inProgressTasks.length})
                </Badge>
              </div>
              <div className="space-y-3">
                {inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>

            {/* Completed Column */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className={getStatusColor('completed')}>
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Completed ({completedTasks.length})
                </Badge>
              </div>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first task to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
