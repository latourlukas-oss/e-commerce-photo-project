import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const STORIES: Record<string, { title: string; description: string }> = {
  'poverty-relief': {
    title: 'Poverty Relief',
    description: 'A portion of every purchase directly supports poverty relief initiatives worldwide.'
  },
  'community-impact': {
    title: 'Community Impact',
    description: 'We partner with local organizations to create lasting change in communities.'
  },
  'global-reach': {
    title: 'Global Reach',
    description: 'Your purchase helps families across the globe access basic necessities.'
  },
  'quality-products': {
    title: 'Quality Products',
    description: 'Premium photo products that preserve your memories beautifully.'
  }
};

export default function StoryPage({ params }: { params: { slug: string } }) {
  const story = STORIES[params?.slug ?? ''];

  if (!story) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-10">
          <span className="text-teal-600 font-medium mb-2 block">Our Purpose</span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            {story.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {story.description}
          </p>
        </div>

        {/* Video section – add your video embed or file here later */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Video</h2>
          <div className="aspect-video max-w-4xl bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500">
            <p className="text-center px-4">
              Video will appear here. You can add an embed code (YouTube, Vimeo, or direct video) later.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
