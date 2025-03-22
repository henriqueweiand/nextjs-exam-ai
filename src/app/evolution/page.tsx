'use client';

import { GraphOverview } from '@/components/GraphOverview';
import { Navbar } from '@/components/Navbar';

export default function ClientPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 max-w-7xl space-y-6">
        <GraphOverview />
      </div>
    </>
  );
}