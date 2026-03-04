import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Page not found</h1>
      <p className="text-slate-600 mb-6">
        The page you’re looking for doesn’t exist or couldn’t be loaded.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
}
