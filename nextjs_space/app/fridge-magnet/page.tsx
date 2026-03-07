'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Magnet, ChevronDown } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/products/fridge-magnet/frame-fridge.png', alt: 'Magnetic photo frame on fridge' },
  { src: '/products/fridge-magnet/frame-wall.png', alt: 'Acrylic frame on wall' },
  { src: '/products/fridge-magnet/frame-wood.png', alt: 'Frame on wood surface' },
  { src: '/products/fridge-magnet/gemini-1.png', alt: 'Magnetic frames with family photos' },
  { src: '/products/fridge-magnet/gemini-2.png', alt: 'Clear acrylic magnetic frames collage' },
];

const PHOTO_COUNTS = Array.from({ length: 25 }, (_, i) => i + 1);

export default function FridgeMagnetPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCount, setSelectedCount] = useState(5);
  const selected = GALLERY_IMAGES[selectedIndex];

  return (
    <div className="min-h-screen bg-white" id="fridge-magnet-page">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          <div className="space-y-4">
            {/* Main display */}
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              {selected && (
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>

            {/* Thumbnail bar */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedIndex === i ? 'border-teal-600 ring-2 ring-teal-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Magnetic Photo Frames
            </h1>
            <p className="text-teal-700 font-medium mb-4">
              Clear acrylic · Blank for your photos · Fridge, wall & more
            </p>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Display your favourite moments with our clear acrylic magnetic photo frames.
              Two panels sandwich your photo, held by small magnetic studs—so the whole frame
              sticks to any metal surface. Perfect for family photos, pets, kids&apos; art, or
              wedding snapshots on the fridge or a magnetic wall.
            </p>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <Magnet className="w-5 h-5 text-teal-600 flex-shrink-0" />
                Strong magnets – stays put on fridge or metal board
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Clear acrylic – no border, just your photo
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Multiple sizes – mix rectangles and squares
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Easy to swap – change the photo anytime
              </li>
            </ul>
            <p className="text-2xl font-bold text-slate-800 mb-6">From $9.99</p>

            <p className="text-sm font-semibold text-slate-700 mb-3">How many photos?</p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative">
                <select
                  id="fridge-magnet-count"
                  value={selectedCount}
                  onChange={(e) => setSelectedCount(Number(e.target.value))}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg py-3 pl-4 pr-10 text-slate-800 font-medium cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none min-w-[140px]"
                  aria-label="Select number of photos (1 to 25)"
                >
                  {PHOTO_COUNTS.map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'photo' : 'photos'}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </div>
              <Link
                href={`/fridge-magnet-upload/${selectedCount}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800 font-medium transition-all"
              >
                Upload {selectedCount} photo{selectedCount !== 1 ? 's' : ''}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
