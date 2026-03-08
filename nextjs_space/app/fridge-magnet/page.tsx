'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Magnet, ChevronDown } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/products/fridge-magnet/frame-1.png', alt: 'Magnetic photo frames – clear acrylic on fridge' },
  { src: '/products/fridge-magnet/frame-2.png', alt: 'Magnetic frames with family photos' },
  { src: '/products/fridge-magnet/frame-3.png', alt: 'Acrylic magnetic frame display' },
  { src: '/products/fridge-magnet/frame-4.png', alt: 'Magnetic photo frames collage' },
  { src: '/products/fridge-magnet/frame-5.png', alt: 'Clear acrylic frames on metal surface' },
  { src: '/products/fridge-magnet/frame-6.png', alt: 'Clear acrylic magnetic frames on refrigerator' },
  { src: '/products/fridge-magnet/frame-7.png', alt: 'Magnetic frames on wall with family photos' },
  { src: '/products/fridge-magnet/frame-8.png', alt: 'Clear acrylic magnetic frames – mix of sizes on white surface' },
  { src: '/products/fridge-magnet/frame-9.png', alt: 'Magnetic photo frames on fridge – family gallery' },
];

const PHOTO_COUNTS = Array.from({ length: 25 }, (_, i) => i + 1);

const FRAME_SIZES = [
  { id: '4x6', label: '4×6"', description: 'Standard' },
  { id: '5x7', label: '5×7"', description: 'Classic' },
  { id: '8x10', label: '8×10"', description: 'Large' },
  { id: '4x4', label: '4×4" square', description: 'Square' },
  { id: '5x5', label: '5×5" square', description: 'Square' },
] as const;

const initialQuantities: Record<string, number> = {
  '4x6': 0, '5x7': 0, '8x10': 0, '4x4': 0, '5x5': 0,
};

export default function FridgeMagnetPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantitiesBySize, setQuantitiesBySize] = useState<Record<string, number>>(initialQuantities);
  const selected = GALLERY_IMAGES[selectedIndex];

  const setQuantity = (sizeId: string, value: number) => {
    setQuantitiesBySize((prev) => ({ ...prev, [sizeId]: value }));
  };

  const totalPhotos = FRAME_SIZES.reduce((sum, s) => sum + (quantitiesBySize[s.id] ?? 0), 0);
  const sizesWithQuantity = FRAME_SIZES.filter((s) => (quantitiesBySize[s.id] ?? 0) > 0);

  return (
    <div className="min-h-screen bg-white" id="fridge-magnet-page">
      <div className="max-w-[1600px] mx-auto px-6 xl:px-10 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid md:grid-cols-2 lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-12 xl:gap-16 mb-16">
          <div className="space-y-4 min-w-0">
            {/* Main display - larger area for product image */}
            <div className="relative w-full aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden min-h-[360px] lg:min-h-[420px]">
              {selected && (
                <img
                  src={selected.src}
                  alt={selected.alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain p-1"
                />
              )}
            </div>

            {/* Thumbnail bar - full images visible, no crop */}
            <div className="flex gap-2 overflow-x-auto overflow-y-visible items-center min-h-[100px] py-1">
              {GALLERY_IMAGES.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors bg-slate-100 flex items-center justify-center ${
                    selectedIndex === i ? 'border-teal-600 ring-2 ring-teal-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.src} alt={img.alt} className="max-w-full max-h-full w-auto h-auto object-contain" />
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

            <p className="text-sm font-semibold text-slate-700 mb-3">Choose how many photos you want in each size</p>
            <p className="text-slate-500 text-sm mb-4">Each size has its own quantity. Select from the dropdowns below — all listed underneath each other.</p>

            <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 mb-6">
              {FRAME_SIZES.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center justify-between gap-4 py-3 border-b border-slate-200 last:border-b-0"
                >
                  <span className="font-medium text-slate-800">{size.label}</span>
                  <div className="relative">
                    <select
                      value={quantitiesBySize[size.id] === 0 ? '' : quantitiesBySize[size.id]}
                      onChange={(e) => setQuantity(size.id, e.target.value === '' ? 0 : Number(e.target.value))}
                      className="appearance-none bg-white border border-slate-200 rounded-lg py-2.5 pl-3 pr-9 text-slate-800 font-medium cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none min-w-[110px]"
                      aria-label={`Amount for ${size.label}`}
                    >
                      <option value="">Select…</option>
                      {PHOTO_COUNTS.map((n) => (
                        <option key={n} value={n}>
                          {n} photo{n === 1 ? '' : 's'}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPhotos > 0 ? (
              <>
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  Total: {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-3">
                  {sizesWithQuantity.map((size) => {
                    const count = quantitiesBySize[size.id] ?? 0;
                    return (
                      <Link
                        key={size.id}
                        href={`/fridge-magnet-upload/${count}?size=${encodeURIComponent(size.id)}`}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-teal-600 bg-teal-50 text-teal-800 font-medium hover:bg-teal-100 transition-colors"
                      >
                        Upload {count} photo{count !== 1 ? 's' : ''} ({size.label})
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm">Select at least one photo above to see upload options.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
