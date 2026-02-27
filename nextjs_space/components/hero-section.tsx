"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
              <span className="text-teal-600">PEOPLES</span>PRINTS
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Transform your cherished memories into beautiful photo products while making a meaningful impact. Every purchase helps fight poverty in communities worldwide.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Shop Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/mission" 
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-300 text-slate-700 hover:border-teal-600 hover:text-teal-600 px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Our Mission
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                  <span className="text-2xl mb-2 block">🖼️</span>
                  <span className="text-sm font-medium text-slate-700">Photo Cubes</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                  <span className="text-2xl mb-2 block">☕</span>
                  <span className="text-sm font-medium text-slate-700">Custom Mugs</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                  <span className="text-2xl mb-2 block">📱</span>
                  <span className="text-sm font-medium text-slate-700">Phone Cases</span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
                  <span className="text-2xl mb-2 block">🎨</span>
                  <span className="text-sm font-medium text-slate-700">Canvas Prints</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
