import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';

export default function PlaceholderPage({ title }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full shadow-sm">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6">
          This feature is currently under development. Stay tuned for updates!
        </p>
        <Button onClick={() => navigate(`/dashboard/${user?.role}`)}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
