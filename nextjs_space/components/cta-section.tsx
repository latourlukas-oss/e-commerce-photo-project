"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, ArrowRight } from 'lucide-react';

export function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="cta" ref={ref} className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-slate-50 rounded-2xl p-8 md:p-12 text-center border border-slate-200"
        >
          <Sparkles className="w-12 h-12 text-teal-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
            Create beautiful photo products and help us fight poverty. Every purchase matters.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
