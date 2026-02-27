"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Users, Globe } from 'lucide-react';

const features = [
  {
    slug: 'poverty-relief' as const,
    icon: Sparkles,
    title: 'Poverty Relief',
    description: 'A portion of every purchase directly supports poverty relief initiatives worldwide.'
  },
  {
    slug: 'community-impact' as const,
    icon: Users,
    title: 'Community Impact',
    description: 'We partner with local organizations to create lasting change in communities.'
  },
  {
    slug: 'global-reach' as const,
    icon: Globe,
    title: 'Global Reach',
    description: 'Your purchase helps families across the globe access basic necessities.'
  },
  {
    slug: 'quality-products' as const,
    icon: Sparkles,
    title: 'Quality Products',
    description: 'Premium photo products that preserve your memories beautifully.'
  }
];

export function MissionSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="mission-cards" ref={ref} className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-600 font-medium mb-2 block">Our Purpose</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            More Than Just Photo Products
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Every order you place creates ripples of positive change. We believe in the power of 
            community and giving back to those in need.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature?.slug ?? index}
              href={`/stories/${feature.slug}`}
              className="block h-full min-h-[220px] rounded-xl overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full bg-slate-50 rounded-xl p-6 hover:shadow-lg hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                  <feature.icon className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature?.title}</h3>
                <p className="text-slate-600 text-sm">{feature?.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
