'use client';

import dynamic from 'next/dynamic';

const MerchStoriesSection = dynamic(
  () => import('@/components/merch-stories-section').then((m) => ({ default: m.MerchStoriesSection })),
  { ssr: false, loading: () => <div className="min-h-screen bg-white flex items-center justify-center"><p className="text-slate-600">Loading...</p></div> }
);

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-white">
      <MerchStoriesSection />
    </div>
  );
}
