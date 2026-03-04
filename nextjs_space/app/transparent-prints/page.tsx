'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, MapPin, Moon, Music, Gift, Truck, Shield, Heart } from 'lucide-react';

const PLAQUE_TYPES = [
  { id: 'map', title: 'Map Plaque', description: 'Pinpoint the memories that matter. Customize with your special place and date.', icon: MapPin, href: '/transparent-prints/create' },
  { id: 'night-sky', title: 'Night Sky', description: 'Hold onto the moment the stars aligned. Personalize with your special date, time & location.', icon: Moon, href: '/transparent-prints/create' },
  { id: 'album', title: 'Album Cover', description: 'The perfect gift for birthdays, anniversaries and weddings. Upload your photo and add your song.', icon: Music, href: '/transparent-prints/create' },
];

const TRUST_BADGES = [
  { icon: Heart, text: '200,000+ Happy Customers' },
  { icon: Gift, text: 'Perfect Gift' },
  { icon: Truck, text: 'Free Worldwide Shipping' },
  { icon: Shield, text: 'Secure Checkout' },
];

export default function TransparentPrintsPage() {
  return (
    <div className="min-h-screen bg-white" id="transparent-prints-page">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <section className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">The Perfect Gift!</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Turn your favourite moments into a keepsake that will last forever. Create your own custom acrylic plaque in seconds.
          </p>
          <Link
            href="/transparent-prints/create"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg"
          >
            Create Plaque
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        <section className="py-8 border-y border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-2">
                <Icon className="w-8 h-8 text-teal-600" />
                <span className="text-sm font-medium text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Choose Your Style</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PLAQUE_TYPES.map(({ id, title, description, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                className="group block p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-teal-300 hover:bg-teal-50/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
                  <Icon className="w-7 h-7 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
                <p className="text-slate-600 text-sm mb-6">{description}</p>
                <span className="inline-flex items-center gap-1 text-teal-600 font-semibold text-sm">
                  Create Plaque
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-16 text-center bg-slate-50 rounded-2xl px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Over 200,000 Happy Couples!</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            We hold every order to the highest standards. Broken or damaged? We’ll make it right.
          </p>
          <Link
            href="/transparent-prints/create"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your Plaque
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
