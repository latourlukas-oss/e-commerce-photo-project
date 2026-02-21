"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="PeoplesPrints Logo" width={32} height={32} className="w-8 h-8 invert" />
            <span className="text-lg font-semibold">PEOPLESPRINTS</span>
          </div>
          
          <nav className="flex gap-6">
            <Link href="/products" className="text-slate-300 hover:text-teal-400 transition-colors">
              Products
            </Link>
            <Link href="/mission" className="text-slate-300 hover:text-teal-400 transition-colors">
              Our Mission
            </Link>
            <Link href="/cart" className="text-slate-300 hover:text-teal-400 transition-colors">
              Cart
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-700 text-center">
          <p className="text-slate-400 text-sm tracking-widest">
            MEMORIES THAT MATTER
          </p>
          <p className="text-slate-500 text-sm mt-2">
            © {new Date().getFullYear()} PEOPLESPRINTS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
