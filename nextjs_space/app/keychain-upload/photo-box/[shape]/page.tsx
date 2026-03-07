import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const VALID_SHAPES = ['circular', 'heart', 'square'];

export default function KeychainPhotoBoxUploadPage({
  params,
}: {
  params: { shape: string };
}) {
  const shape = params?.shape?.toLowerCase();
  if (!shape || !VALID_SHAPES.includes(shape)) notFound();

  const label = shape.charAt(0).toUpperCase() + shape.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link href="/keychain" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Keychains
        </Link>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Photo Box Keychain — {label}</h1>
          <p className="text-slate-600 mb-8">Upload your photo for your {label.toLowerCase()} keychain. This flow is coming soon.</p>
          <Link href="/keychain" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Keychains
          </Link>
        </div>
      </div>
    </div>
  );
}
