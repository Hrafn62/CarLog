"use client";

import { useAuth } from '@/lib/hooks';
import Login from '@/components/auth/Login';
import Dashboard from '@/components/dashboard/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { CarFront } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <CarFront className="h-16 w-16 text-primary animate-pulse" />
      <Skeleton className="h-4 w-48 mt-4" />
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main>
      {user ? <Dashboard user={user} /> : <Login />}
    </main>
  );
}
