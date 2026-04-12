import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Building } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      // Assuming successful login returns { user, token }
      const res = await axios.post('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('Logged in successfully!');
      navigate(`/dashboard/${data.user.role}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to login');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // For demo purposes, if API isn't ready or we want local dev speed:
    if (email === 'admin@test.com') {
      login({ name: 'Admin User', email, role: 'admin', unit: 'Office' }, 'mock-token');
      navigate('/dashboard/admin');
      return;
    }
    if (email === 'guard@test.com') {
      login({ name: 'Security Guard', email, role: 'guard', unit: 'Main Gate' }, 'mock-token');
      navigate('/dashboard/guard');
      return;
    }
    if (email === 'resident@test.com') {
      login({ name: 'John Doe', email, role: 'resident', unit: 'A-1201', familyMembers: [] }, 'mock-token');
      navigate('/dashboard/resident');
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-muted/30">
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-foreground p-12">
        <Building className="h-24 w-24 mb-8 opacity-80" />
        <h1 className="text-4xl font-bold mb-4">Welcome to SmartSociety</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          A premium, modern platform to manage your residential society with ease. Security, community, and management in one place.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="flex lg:hidden flex-col items-center mb-8 text-primary">
          <Building className="h-12 w-12 mb-2" />
          <h1 className="text-2xl font-bold">SmartSociety</h1>
        </div>

        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="bg-muted p-3 text-xs rounded-lg mt-4 border border-border/50">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>admin@test.com</p>
                <p>guard@test.com</p>
                <p>resident@test.com</p>
              </div>

              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t p-6 pb-6">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
