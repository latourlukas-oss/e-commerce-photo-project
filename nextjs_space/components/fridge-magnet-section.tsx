'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Magnet, ChevronDown, ArrowRight } from 'lucide-react';

const PHOTO_COUNTS = Array.from({ length: 25 }, (_, i) => i + 1); // 1 to 25

export function FridgeMagnetSection() {
  const router = useRouter();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedCount, setSelectedCount] = useState(5);

  const handleGoToUpload = () => {
    router.push(`/fridge-magnet-upload/${selectedCount}`);
  };

  return (
    <section id="fridge-magnets" ref={ref} className="py-16 md:py-20 bg-slate-50/50">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Custom Fridge Magnets
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose how many photos you want on your magnet set. We&apos;ll print and ship them to you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Magnet className="w-10 h-10 text-teal-600 flex-shrink-0" />
              <div className="flex-1">
                <label htmlFor="fridge-magnet-count" className="block text-sm font-medium text-slate-700 mb-2">
                  Number of photos
                </label>
                {/* Birth-year style dropdown: compact button that opens a list of numbers */}
                <div className="relative">
                  <select
                    id="fridge-magnet-count"
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(Number(e.target.value))}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg py-3 pl-4 pr-10 text-slate-800 font-medium cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none"
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
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoToUpload}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Upload {selectedCount} photo{selectedCount !== 1 ? 's' : ''}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
