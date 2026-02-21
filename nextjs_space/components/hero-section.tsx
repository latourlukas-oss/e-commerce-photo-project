"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900">
        <div className="absolute inset-0 bg-[url('/og-image.png')] bg-cover bg-center opacity-10" />
      </div>
      
      <div className="relative max-w-[1200px] mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-orange-400" />
              <span className="text-orange-300 font-medium tracking-widest">MEMORIES THAT MATTER</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="text-orange-400">PEOPLES</span>PRINTS
            </h1>
            
            <p className="text-xl text-teal-100 mb-8 leading-relaxed">
              Transform your cherished memories into beautiful photo products while making a meaningful impact. Every purchase helps fight poverty in communities worldwide.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Shop Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/mission" 
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all border border-white/30"
              >
                Our Mission
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-500/20 rounded-2xl blur-xl" />
              <div className="relative aspect-square bg-gradient-to-br from-teal-500/30 to-orange-500/30 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-white/10 rounded-lg flex items-center justify-center text-white/70 text-sm p-4">
                    <span className="text-center">🖼️ Photo Cubes</span>
                  </div>
                  <div className="bg-white/10 rounded-lg flex items-center justify-center text-white/70 text-sm p-4">
                    <span className="text-center">☕ Custom Mugs</span>
                  </div>
                  <div className="bg-white/10 rounded-lg flex items-center justify-center text-white/70 text-sm p-4">
                    <span className="text-center">📱 Phone Cases</span>
                  </div>
                  <div className="bg-white/10 rounded-lg flex items-center justify-center text-white/70 text-sm p-4">
                    <span className="text-center">🎨 Canvas Prints</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
