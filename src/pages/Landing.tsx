
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Users, 
  Lightbulb, 
  Shield, 
  CheckSquare,
  ArrowRight,
  Star,
  Zap,
  Globe
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: FileText,
      title: 'Smart Reporting',
      description: 'Submit and track reports for crime, litter, grievances, and e-waste with real-time updates.',
      color: 'text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Easy Bookings',
      description: 'Book workspaces, bed rolls, and pet services with our streamlined booking system.',
      color: 'text-green-600',
    },
    {
      icon: Users,
      title: 'Event Discovery',
      description: 'Discover and register for music events, workshops, and community gatherings.',
      color: 'text-purple-600',
    },
    {
      icon: Lightbulb,
      title: 'Personalized Recommendations',
      description: 'Get AI-powered diet, learning, and fitness plans tailored to your needs.',
      color: 'text-orange-600',
    },
    {
      icon: CheckSquare,
      title: 'Real-time Collaboration',
      description: 'Work together on tasks and projects with our collaborative to-do system.',
      color: 'text-cyan-600',
    },
    {
      icon: Shield,
      title: 'Secure Document Access',
      description: 'Access exam papers and important documents with role-based security.',
      color: 'text-red-600',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Community Manager',
      content: 'This platform has transformed how our community handles reporting and event management.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Small Business Owner',
      content: 'The booking system is incredibly intuitive. I use it weekly for workspace reservations.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'University Professor',
      content: 'The secure document system is perfect for distributing exam materials safely.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Reports Processed', value: '50,000+' },
    { label: 'Events Hosted', value: '2,500+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl">MERN App</span>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="mr-1 h-3 w-3" />
            New Features Available
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Your All-in-One
            <br />
            Community Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Report issues, book services, discover events, collaborate on tasks, and access secure documents - all in one powerful platform designed for modern communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline community management and enhance user experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by Communities Worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say about their experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of communities already using our platform to streamline operations and enhance engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600">
              <Globe className="mr-2 h-5 w-5" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-white px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl">MERN App</span>
            </div>
            <div className="text-muted-foreground">
              © 2024 MERN App. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
