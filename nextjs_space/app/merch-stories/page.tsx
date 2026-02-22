"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Play, Heart, Shirt, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Placeholder stories - replace with actual content
const stories = [
  {
    id: 1,
    title: 'Helping Families in Need',
    description: 'Watch how your purchases helped provide meals and shelter for families.',
    thumbnail: '/stories/story-1.jpg',
    videoUrl: '#'
  },
  {
    id: 2,
    title: 'Community Building',
    description: 'See the impact we\'ve made together in local communities.',
    thumbnail: '/stories/story-2.jpg',
    videoUrl: '#'
  },
  {
    id: 3,
    title: 'Education Support',
    description: 'Discover how we\'re helping children access education.',
    thumbnail: '/stories/story-3.jpg',
    videoUrl: '#'
  }
];

// Placeholder merch items - replace with actual products
const merchItems = [
  {
    id: 1,
    name: 'PeoplesPrints T-Shirt',
    description: 'Comfortable cotton tee with our mission on your heart.',
    price: 29.99,
    image: '/merch/tshirt.jpg'
  },
  {
    id: 2,
    name: 'Hoodie',
    description: 'Stay warm while spreading kindness.',
    price: 49.99,
    image: '/merch/hoodie.jpg'
  },
  {
    id: 3,
    name: 'Cap',
    description: 'Classic cap with embroidered logo.',
    price: 24.99,
    image: '/merch/cap.jpg'
  }
];

export default function MerchStoriesPage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [storiesRef, storiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [merchRef, merchInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section ref={heroRef} className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-orange-400" />
              <span className="text-orange-300 font-medium tracking-widest">MERCH & STORIES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See the Impact & Wear the Mission
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Watch real stories of people we&apos;ve helped and shop merchandise that supports our cause.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Section */}
      <section ref={storiesRef} className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={storiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-medium">Impact Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
              People We&apos;ve Helped
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Every purchase you make contributes to real change. Watch these stories of hope and transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={storiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-video bg-slate-200 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-orange-500/20" />
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-8 h-8 text-teal-600 ml-1" />
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Coming Soon
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{story.title}</h3>
                  <p className="text-slate-600 text-sm">{story.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-500 italic">
              Videos coming soon! We&apos;re documenting our impact and will share stories here.
            </p>
          </div>
        </div>
      </section>

      {/* Merch Section */}
      <section ref={merchRef} className="py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={merchInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-medium">Shop the Cause</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-4">
              Merchandise
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Wear your support! All proceeds from merchandise go directly to helping those in need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={merchInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
              >
                <div className="aspect-square bg-slate-100 relative flex items-center justify-center">
                  <Shirt className="w-24 h-24 text-slate-300" />
                  <span className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded font-medium">
                    Coming Soon
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-teal-600">${item.price.toFixed(2)}</span>
                    <span className="text-sm text-slate-400">Available Soon</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-500 italic mb-6">
              Merchandise coming soon! Sign up to be notified when items are available.
            </p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Shop Photo Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
