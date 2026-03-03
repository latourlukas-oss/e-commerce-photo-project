'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 bg-slate-50">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h2>
      <p className="text-slate-600 text-sm mb-4 max-w-md text-center">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
