import { notFound } from 'next/navigation';
import { CanvasPrintUploadForm } from './CanvasPrintUploadForm';

const VALID_SIZES = ['8x10', '11x14', '12x16', '16x20', '18x24', '20x24', '24x36'];

export default function CanvasPrintUploadPage({
  params,
}: {
  params: { size: string };
}) {
  const size = params?.size ?? '';
  if (!VALID_SIZES.includes(size)) notFound();

  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <CanvasPrintUploadForm />
      </div>
    </div>
  );
}
