import { Suspense } from 'react';
import { SuccessContent } from './success-content';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center">
        <div className="animate-pulse">
          <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4" />
          <div className="w-48 h-6 bg-slate-200 rounded mx-auto mb-2" />
          <div className="w-64 h-4 bg-slate-200 rounded mx-auto" />
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
