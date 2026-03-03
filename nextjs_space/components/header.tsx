"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Home, Package, Info, Heart, Box, Magnet, ImageIcon } from 'lucide-react';
import { useCart } from './cart-provider';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const itemCount = cart?.items?.length ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="PeoplesPrints Logo" width={40} height={40} className="w-10 h-10" />
            <span className="text-xl font-bold text-slate-800">PEOPLESPRINTS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link href="/photo-cube" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <Box className="w-4 h-4" />
              <span>Photo Cube</span>
            </Link>
            <Link href="/fridge-magnet" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <Magnet className="w-4 h-4" />
              <span>Fridge Magnets</span>
            </Link>
            <Link href="/canvas-print" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <ImageIcon className="w-4 h-4" />
              <span>Canvas Print</span>
            </Link>
            <Link href="/products" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
            <Link href="/mission" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <Info className="w-4 h-4" />
              <span>Our Mission</span>
            </Link>
            <Link href="/merch-stories" className="flex items-center gap-1 text-slate-600 hover:text-teal-600 transition-colors">
              <Heart className="w-4 h-4" />
              <span>Merch & Stories</span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/cart" 
              className="relative p-2 text-slate-600 hover:text-teal-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 flex flex-col gap-2"
            >
              <Link 
                href="/" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link 
                href="/photo-cube" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Box className="w-5 h-5" />
                <span>Photo Cube</span>
              </Link>
              <Link 
                href="/fridge-magnet" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Magnet className="w-5 h-5" />
                <span>Fridge Magnets</span>
              </Link>
              <Link 
                href="/canvas-print" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ImageIcon className="w-5 h-5" />
                <span>Canvas Print</span>
              </Link>
              <Link 
                href="/products" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className="w-5 h-5" />
                <span>Products</span>
              </Link>
              <Link 
                href="/mission" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Info className="w-5 h-5" />
                <span>Our Mission</span>
              </Link>
              <Link 
                href="/merch-stories" 
                className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span>Merch & Stories</span>
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
