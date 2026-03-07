import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function KeychainClassicUploadPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link href="/keychain" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Keychains
        </Link>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Classic Photo Keychain</h1>
          <p className="text-slate-600 mb-8">Upload your photo for your classic keychain. This flow is coming soon.</p>
          <Link href="/keychain" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Keychains
          </Link>
        </div>
      </div>
    </div>
  );
}
