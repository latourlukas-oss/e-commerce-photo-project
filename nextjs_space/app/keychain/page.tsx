'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Circle, Heart, Square, Key } from 'lucide-react';

const SHAPES = [
  { id: 'circular', label: 'Circular', icon: Circle, href: '/keychain-upload/photo-box/circular', description: 'Round photo box' },
  { id: 'heart', label: 'Heart', icon: Heart, href: '/keychain-upload/photo-box/heart', description: 'Heart shape' },
  { id: 'square', label: 'Square', icon: Square, href: '/keychain-upload/photo-box/square', description: 'Square frame' },
];

export default function KeychainPage() {
  return (
    <div className="min-h-screen bg-white" id="keychain-page">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero – Photo Box Ornament style (Alibaba-inspired) */}
        <section className="text-center py-10 md:py-14">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Photo Box Keychain</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-2">
            OEM-style customisation. Choose your shape, add your photo — we print and ship.
          </p>
          <p className="text-slate-500 max-w-xl mx-auto">
            Like the Duoying photo box ornament: circular, heart, or square. Perfect for gifts and keepsakes.
          </p>
        </section>

        {/* 3 shape selections – circular, heart, square (Alibaba-style) */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Choose shape</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SHAPES.map(({ id, label, icon: Icon, href, description }) => (
              <Link
                key={id}
                href={href}
                className="group block rounded-2xl border-2 border-slate-200 bg-white p-8 text-center hover:border-teal-400 hover:shadow-lg transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                  <Icon className="w-10 h-10 text-slate-600 group-hover:text-teal-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{label}</h3>
                <p className="text-sm text-slate-500 mb-4">{description}</p>
                <span className="inline-flex items-center gap-1 text-teal-600 font-semibold text-sm">
                  Customise
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Second product: Classic Photo Keychain */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-square relative bg-slate-100 min-h-[200px]">
              <Image
                src="/products/keychain.jpg"
                alt="Classic photo keychain"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Classic Photo Keychain</h2>
              <p className="text-slate-600 mb-6">
                Rectangular keychain with your photo. Silver frame, clear insert. Ideal for couples or family.
              </p>
              <Link
                href="/keychain-upload/classic"
                className="inline-flex items-center gap-2 w-fit px-5 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-800 font-medium transition-all"
              >
                <Key className="w-4 h-4" />
                Customise
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
