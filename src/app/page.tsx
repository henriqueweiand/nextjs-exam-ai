'use client';

import { useAuth, useClerk } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientPage from './client-page';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);

  if (!userId) {
    return null; // or a loading spinner
  }

  const handleLogout = () => {
    signOut(() => router.push('/sign-in'));
  };

  return (
    <div>
      <div className="flex justify-end p-4">
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
      <ClientPage />
    </div>
  );
}