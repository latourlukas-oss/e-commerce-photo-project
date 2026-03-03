'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ImageIcon, ChevronDown, ArrowRight } from 'lucide-react';

// Common canvas/print sizes (inches): slug -> display label
const CANVAS_SIZES: { slug: string; label: string }[] = [
  { slug: '8x10', label: '8" × 10"' },
  { slug: '11x14', label: '11" × 14"' },
  { slug: '12x16', label: '12" × 16"' },
  { slug: '16x20', label: '16" × 20"' },
  { slug: '18x24', label: '18" × 24"' },
  { slug: '20x24', label: '20" × 24"' },
  { slug: '24x36', label: '24" × 36"' },
];

export function CanvasPrintSection() {
  const router = useRouter();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedSize, setSelectedSize] = useState(CANVAS_SIZES[2].slug); // 12x16 default

  const selectedLabel = CANVAS_SIZES.find((s) => s.slug === selectedSize)?.label ?? selectedSize;

  const handleGoToUpload = () => {
    router.push(`/canvas-print-upload/${selectedSize}`);
  };

  return (
    <section id="canvas-print" ref={ref} className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Premium Canvas Print
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gallery-quality canvas prints for your walls. Choose your size, upload your photo, and we&apos;ll create your print.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-10 h-10 text-teal-600 flex-shrink-0" />
              <div className="flex-1">
                <label htmlFor="canvas-size" className="block text-sm font-medium text-slate-700 mb-2">
                  Size
                </label>
                <div className="relative">
                  <select
                    id="canvas-size"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 pl-4 pr-10 text-slate-800 font-medium cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
                    aria-label="Select canvas size"
                  >
                    {CANVAS_SIZES.map(({ slug, label }) => (
                      <option key={slug} value={slug}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ChevronDown className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoToUpload}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Continue with {selectedLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
