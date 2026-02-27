'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Images, ArrowRight } from 'lucide-react';

const OPTIONS = [
  { faces: 5, label: '5 Pictures', description: 'Compact cube with 5 of your photos' },
  { faces: 8, label: '8 Pictures', description: 'Classic cube with 8 photo faces' },
  { faces: 12, label: '12 Pictures', description: 'Full cube with 12 photo faces' },
] as const;

export function CubeUploadSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="cta" ref={ref} className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Photo Cube – Choose Your Size
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our cubes are assembled in China. Upload your photos and our factory will print and assemble your cube. Choose how many faces you want.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {OPTIONS.map(({ faces, label, description }, i) => (
            <motion.div
              key={faces}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={`/cube-upload/${faces}`}
                className="block h-full bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all text-center group"
              >
                <Images className="w-12 h-12 text-teal-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">{label}</h3>
                <p className="text-slate-600 text-sm mb-6">{description}</p>
                <span className="inline-flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all">
                  Upload {faces} photos
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
