"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Play, Heart } from 'lucide-react';

const stories = [
  { title: 'Helping Families', description: 'Watch how your purchases helped families in need' },
  { title: 'Community Impact', description: 'See the difference we make together' },
  { title: 'Education Support', description: 'Helping children access education' }
];

const merchItems = [
  { name: 'T-Shirt', price: 29.99, description: 'Wear the mission', image: '/merch/tshirt.jpg' },
  { name: 'Hoodie', price: 49.99, description: 'Stay warm, spread kindness', image: '/merch/hoodie.jpg' },
  { name: 'Cap', price: 24.99, description: 'Classic embroidered logo', image: '/merch/cap.jpg' }
];

export function MerchStoriesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="merch-stories" ref={ref} className="py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-teal-600 font-medium mb-2 block flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Merch & Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              See the Impact & Wear the Mission
            </h2>
          </div>
          <Link 
            href="/merch-stories" 
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mt-4 md:mt-0"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Stories Row */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Impact Stories</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story?.title ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href="/merch-stories">
                  <div className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 border border-slate-100 transition-all group cursor-pointer h-full">
                    <div className="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center relative">
                      <Play className="w-12 h-12 text-slate-400 group-hover:text-teal-600 transition-all" />
                      <span className="absolute bottom-2 left-2 bg-slate-600 text-white text-xs px-2 py-1 rounded">Coming Soon</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-1">{story?.title}</h4>
                    <p className="text-slate-600 text-sm">{story?.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Merch Row */}
        <div>
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Merchandise</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {merchItems.map((item, index) => (
              <motion.div
                key={item?.name ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
              >
                <Link href="/merch-stories">
                  <div className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 border border-slate-100 transition-all group cursor-pointer h-full">
                    <div className="aspect-square rounded-lg mb-4 relative overflow-hidden bg-white border border-slate-100">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-teal-600 text-white text-xs px-2 py-1 rounded font-medium">Coming Soon</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-1">{item?.name}</h4>
                    <p className="text-slate-600 text-sm mb-3">{item?.description}</p>
                    <span className="text-xl font-bold text-teal-600">${item?.price?.toFixed?.(2) ?? '0.00'}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
