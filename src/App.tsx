
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import Recommendations from "./pages/Recommendations";
import Collaboration from "./pages/Collaboration";
import Documents from "./pages/Documents";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with dashboard layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/bookings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Bookings />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/events" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Events />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/recommendations" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Recommendations />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/collab" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Collaboration />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/documents" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Documents />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin only routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <DashboardLayout>
                  <Admin />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
