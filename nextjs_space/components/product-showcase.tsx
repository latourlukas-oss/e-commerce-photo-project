"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Box, Key, Magnet, Coffee, Image as ImageIcon, Smartphone } from 'lucide-react';

const products = [
  { name: 'Photo Cube', price: 24.99, icon: Box, description: 'A 3D rotating cube with your photos' },
  { name: 'Keychain', price: 12.99, icon: Key, description: 'Keep memories close wherever you go' },
  { name: 'Fridge Magnet', price: 9.99, icon: Magnet, description: 'Display memories on any magnetic surface' },
  { name: 'Custom Mug', price: 18.99, icon: Coffee, description: 'Start your day with a smile' },
  { name: 'Canvas Print', price: 49.99, icon: ImageIcon, description: 'Gallery-quality prints for your walls' },
  { name: 'Phone Case', price: 29.99, icon: Smartphone, description: 'Protect your phone with your favorite photo' }
];

export function ProductShowcase() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-slate-100">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-teal-600 font-medium mb-2 block">Our Products</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              Create Your Custom Photo Products
            </h2>
          </div>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mt-4 md:mt-0"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product?.name ?? index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href="/products">
                <div className="bg-white rounded-xl p-6 hover:shadow-xl transition-all group cursor-pointer h-full">
                  <div className="aspect-video bg-gradient-to-br from-teal-50 to-orange-50 rounded-lg mb-4 flex items-center justify-center group-hover:from-teal-100 group-hover:to-orange-100 transition-all">
                    <product.icon className="w-16 h-16 text-teal-600 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{product?.name}</h3>
                  <p className="text-slate-500 text-sm mb-3">{product?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-teal-600">${product?.price?.toFixed?.(2) ?? '0.00'}</span>
                    <span className="text-sm text-orange-500 font-medium">Customize →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
