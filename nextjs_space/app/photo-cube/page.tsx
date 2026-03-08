'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Lightbulb, Play, RotateCcw } from 'lucide-react';
import { CubeUploadSection } from '@/components/cube-upload-section';

const GALLERY_IMAGES = [
  '/products/photo-cube/cube-1.png',
  '/products/photo-cube/cube-2.png',
  '/products/photo-cube/cube-3.png',
  '/products/photo-cube/cube-4.png',
  '/products/photo-cube/cube-5.png',
  '/products/photo-cube/cube-6.png',
  '/products/photo-cube/cube-7.png',
  '/products/photo-cube/cube-8.png',
  '/products/photo-cube/cube-9.png',
];

// Only include videos that exist in public/products/photo-cube/
const GALLERY_VIDEOS = [
  '/products/photo-cube/video-1.mov',
];

type GalleryItem = { type: 'image'; src: string } | { type: 'video'; src: string };

const GALLERY_ITEMS: GalleryItem[] = [
  ...GALLERY_IMAGES.map((src) => ({ type: 'image' as const, src })),
  ...GALLERY_VIDEOS.map((src) => ({ type: 'video' as const, src })),
];

const OPTIONS = [
  { faces: 5, label: '5 Pictures', description: 'Compact cube with 5 of your photos. Turn the crank to cycle through your favourite moments.' },
  { faces: 8, label: '8 Pictures', description: 'Classic cube with 8 photo faces. Perfect for a small collection.' },
  { faces: 12, label: '12 Pictures', description: 'Full cube with 12 photo faces. Maximum memories in one place.' },
] as const;

export default function PhotoCubePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredVideoIndex, setHoveredVideoIndex] = useState<number | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  const selectedItem = GALLERY_ITEMS[selectedIndex];
  const displayVideoIndex = hoveredVideoIndex ?? (selectedItem?.type === 'video' ? selectedIndex : null);
  const displayImageIndex = displayVideoIndex == null ? selectedIndex : null;

  const handleVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    videoRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-white" id="photo-cube-page">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 lg:grid-cols-[1.15fr_1fr] gap-10 xl:gap-16 mb-16">
          <div className="space-y-4 min-w-0">
            {/* Main display: image or playing video */}
            <div className="relative aspect-square min-h-[360px] lg:min-h-[420px] bg-[#f8f6f3] rounded-2xl overflow-hidden border border-amber-900/10 shadow-inner">
              {displayVideoIndex != null && GALLERY_ITEMS[displayVideoIndex]?.type === 'video' ? (
                <video
                  ref={handleVideoRef(displayVideoIndex)}
                  src={GALLERY_ITEMS[displayVideoIndex]!.src}
                  className="absolute inset-0 w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
                  onPlay={() => {
                    Object.entries(videoRefs.current).forEach(([i, v]) => {
                      if (Number(i) !== displayVideoIndex && v) v.pause();
                    });
                  }}
                />
              ) : (
                displayImageIndex != null && GALLERY_ITEMS[displayImageIndex]?.type === 'image' && (
                  <Image
                    src={GALLERY_ITEMS[displayImageIndex]!.src}
                    alt="Mechanical Photo Cube – hand-cranked flipbook frame"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                )
              )}
            </div>

            {/* Thumbnail bar: images + video thumbnails; hover on video = play in main display */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {GALLERY_ITEMS.map((item, i) => {
                const isSelected = selectedIndex === i && hoveredVideoIndex == null;
                const isVideo = item.type === 'video';
                return (
                  <button
                    key={item.type === 'image' ? item.src : `${item.src}-${i}`}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(i);
                      setHoveredVideoIndex(null);
                    }}
                    onMouseEnter={() => {
                      if (isVideo) setHoveredVideoIndex(i);
                    }}
                    onMouseLeave={() => {
                      if (isVideo) setHoveredVideoIndex(null);
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      isSelected ? 'border-amber-800 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {item.type === 'image' ? (
                      <Image src={item.src} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <>
                        <video
                          src={item.src}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-6 h-6 text-white drop-shadow" fill="white" />
                        </span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Custom Photo Flipbook Frame
            </h1>
            <p className="text-amber-800 font-medium mb-4">
              Mechanical hand-cranked photo album with light · Black walnut · Baby photo cube frame
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              A beautiful wooden photo cube with a hand-crank mechanism. Load it with your favourite
              photos and turn the crank to cycle through them—like a mechanical flipbook or animation.
              Choose 5, 8, or 12 photos; we&apos;ll print and assemble your cube. With built-in warm light for display.
            </p>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-700 flex-shrink-0" />
                Hand-crank to change the displayed photo
              </li>
              <li className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0" />
                With light – illuminated display for your photos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Black walnut or light wood finish
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Creative gift: weddings, baby, family moments
              </li>
            </ul>
            <p className="text-2xl font-bold text-slate-800 mb-8">From $24.99</p>

            <p className="text-sm font-semibold text-slate-700 mb-3">Choose how many photos</p>
            <div className="flex flex-wrap gap-3">
              {OPTIONS.map(({ faces, label }) => (
                <Link
                  key={faces}
                  href={`/cube-upload/${faces}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-amber-600 hover:bg-amber-50 hover:text-amber-800 font-medium transition-all"
                >
                  {label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <CubeUploadSection />
      </div>
    </div>
  );
}
