import { notFound } from 'next/navigation';
import { CubeUploadForm } from './CubeUploadForm';

const VALID_FACES = [5, 8, 12];

export default function CubeUploadPage({
  params,
}: {
  params: { faces: string };
}) {
  const faces = Number(params?.faces);
  if (!VALID_FACES.includes(faces)) notFound();

  return (
    <div className="py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <CubeUploadForm />
      </div>
    </div>
  );
}
