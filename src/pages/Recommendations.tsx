
import { useState, useEffect } from 'react';
import { Recommendation } from '@/types';
import { RECOMMENDATION_TYPES } from '@/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, Apple, BookOpen, Dumbbell, Star, Clock, Target, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Mediterranean Diet Plan',
    type: 'diet',
    description: 'A heart-healthy eating plan that emphasizes fruits, vegetables, whole grains, and healthy fats.',
    plan: [
      'Start your day with Greek yogurt and berries',
      'Include olive oil in your meals',
      'Eat fish twice a week',
      'Consume plenty of vegetables and fruits',
      'Choose whole grains over refined ones',
    ],
    duration: '4 weeks',
    difficulty: 'beginner',
    userId: '1',
  },
  {
    id: '2',
    title: 'Full Stack Web Development',
    type: 'learning',
    description: 'Comprehensive course covering React, Node.js, databases, and modern web development practices.',
    plan: [
      'HTML, CSS, and JavaScript fundamentals',
      'React and component-based architecture',
      'Node.js and Express server development',
      'Database design and MongoDB',
      'Authentication and security',
      'Deployment and DevOps basics',
    ],
    duration: '12 weeks',
    difficulty: 'intermediate',
    userId: '1',
  },
  {
    id: '3',
    title: 'Beginner Strength Training',
    type: 'fitness',
    description: 'Progressive strength training program designed for beginners to build muscle and improve overall fitness.',
    plan: [
      'Bodyweight exercises and form practice',
      'Introduction to compound movements',
      'Progressive overload principles',
      'Rest and recovery protocols',
      'Nutrition for muscle building',
    ],
    duration: '8 weeks',
    difficulty: 'beginner',
    userId: '1',
  },
  {
    id: '4',
    title: 'Advanced Fitness Challenge',
    type: 'fitness',
    description: 'High-intensity training program for experienced athletes looking to push their limits.',
    plan: [
      'Olympic lifting techniques',
      'High-intensity interval training',
      'Advanced mobility work',
      'Competition preparation',
      'Recovery and injury prevention',
    ],
    duration: '16 weeks',
    difficulty: 'advanced',
    userId: '1',
  },
];

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [enrolledPlans, setEnrolledPlans] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setRecommendations(mockRecommendations);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to load recommendations');
      setIsLoading(false);
    }
  };

  const handleEnroll = (id: string) => {
    setEnrolledPlans(prev => new Set(prev).add(id));
    toast.success('Successfully enrolled in plan!');
  };

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'diet': return <Apple className="h-4 w-4" />;
      case 'learning': return <BookOpen className="h-4 w-4" />;
      case 'fitness': return <Dumbbell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'diet': return 'bg-green-100 text-green-800';
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'fitness': return 'bg-red-100 text-red-800';
    }
  };

  const getDifficultyColor = (difficulty: Recommendation['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
    }
  };

  const getDifficultyStars = (difficulty: Recommendation['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesType = typeFilter === 'all' || rec.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'all' || rec.difficulty === difficultyFilter;
    return matchesType && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Recommendations</h1>
        <p className="text-muted-foreground">Personalized plans to help you achieve your goals</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">3</div>
                <div className="text-sm text-muted-foreground">Active Plans</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold">68%</div>
                <div className="text-sm text-muted-foreground">Avg. Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold">4.8</div>
                <div className="text-sm text-muted-foreground">Avg. Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value={RECOMMENDATION_TYPES.DIET}>Diet</SelectItem>
            <SelectItem value={RECOMMENDATION_TYPES.LEARNING}>Learning</SelectItem>
            <SelectItem value={RECOMMENDATION_TYPES.FITNESS}>Fitness</SelectItem>
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Recommendations Grid */}
      {filteredRecommendations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new recommendations
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Plans */}
          {enrolledPlans.size > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Active Plans</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredRecommendations
                  .filter(rec => enrolledPlans.has(rec.id))
                  .map((recommendation) => (
                    <Card key={recommendation.id} className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={getTypeColor(recommendation.type)}>
                                <span className="flex items-center space-x-1">
                                  {getTypeIcon(recommendation.type)}
                                  <span className="capitalize">{recommendation.type}</span>
                                </span>
                              </Badge>
                              <Badge variant="secondary" className={getDifficultyColor(recommendation.difficulty)}>
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: getDifficultyStars(recommendation.difficulty) }).map((_, i) => (
                                    <Star key={i} className="h-3 w-3 fill-current" />
                                  ))}
                                  <span className="capitalize">{recommendation.difficulty}</span>
                                </div>
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {recommendation.duration}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>68%</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                          <Button variant="outline" className="w-full">
                            Continue Plan
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Available Recommendations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {enrolledPlans.size > 0 ? 'Discover More Plans' : 'Recommended for You'}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {filteredRecommendations
                .filter(rec => !enrolledPlans.has(rec.id))
                .map((recommendation) => (
                  <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={getTypeColor(recommendation.type)}>
                              <span className="flex items-center space-x-1">
                                {getTypeIcon(recommendation.type)}
                                <span className="capitalize">{recommendation.type}</span>
                              </span>
                            </Badge>
                            <Badge variant="secondary" className={getDifficultyColor(recommendation.difficulty)}>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: getDifficultyStars(recommendation.difficulty) }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                                <span className="capitalize">{recommendation.difficulty}</span>
                              </div>
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {recommendation.duration}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription>
                        {recommendation.description}
                      </CardDescription>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">What you'll learn:</h4>
                        <ul className="space-y-1">
                          {recommendation.plan.slice(0, 3).map((item, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                          {recommendation.plan.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{recommendation.plan.length - 3} more items
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleEnroll(recommendation.id)}
                      >
                        Start Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
