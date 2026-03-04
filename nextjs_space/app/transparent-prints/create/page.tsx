import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TransparentPrintsCreatePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link
          href="/transparent-prints"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transparent Prints
        </Link>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Create Your Plaque</h1>
          <p className="text-slate-600 mb-8">Upload your photo and customize your acrylic plaque. This flow is coming soon.</p>
          <Link
            href="/transparent-prints"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Transparent Prints
          </Link>
        </div>
      </div>
    </div>
  );
}
