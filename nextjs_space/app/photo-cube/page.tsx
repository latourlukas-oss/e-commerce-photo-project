import Link from 'next/link';
import { CubeUploadSection } from '@/components/cube-upload-section';
import { ArrowLeft } from 'lucide-react';

export default function PhotoCubePage() {
  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <CubeUploadSection />
      </div>
    </div>
  );
}
