import { notFound } from 'next/navigation';
import { FridgeMagnetUploadForm } from './FridgeMagnetUploadForm';

export default function FridgeMagnetUploadPage({
  params,
}: {
  params: { count: string };
}) {
  const count = Number(params?.count);
  if (!Number.isInteger(count) || count < 1 || count > 25) notFound();

  return (
    <div className="py-12">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10">
        <FridgeMagnetUploadForm />
      </div>
    </div>
  );
}
