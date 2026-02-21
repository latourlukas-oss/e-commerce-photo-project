"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Users, Globe, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MissionPage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [storyRef, storyInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [impactRef, impactInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div>
      {/* Hero Section */}
      <section ref={heroRef} className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Sparkles className="w-16 h-16 text-orange-400  mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              From the People, To the People
            </h1>
            <p className="text-xl text-teal-100">
              At PeoplesPrints, we believe every purchase should have purpose. 
              We&apos;re not just creating photo products — we&apos;re creating change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-teal-600 font-medium mb-2 block">Our Story</span>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Why We Started</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  PeoplesPrints was born from a simple idea: what if every cherished memory 
                  could also be a gift to someone in need? We saw an opportunity to connect 
                  two beautiful things — your precious photos and the power of giving.
                </p>
                <p>
                  Our founders witnessed firsthand the impact that small contributions can 
                  make in communities facing poverty. They realized that if we could channel 
                  the joy of preserving memories into supporting those in need, we could 
                  create something truly meaningful.
                </p>
                <p>
                  Today, every photo cube, keychain, mug, and canvas print you create doesn&apos;t 
                  just preserve your memories — it helps provide essentials like food, clean 
                  water, education, and healthcare to families around the world.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 text-center">
                <Sparkles className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-teal-600">100%</p>
                <p className="text-sm text-slate-600">Committed to Change</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-orange-600">5000+</p>
                <p className="text-sm text-slate-600">Families Helped</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                <Globe className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-orange-600">25+</p>
                <p className="text-sm text-slate-600">Countries Reached</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 text-teal-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-teal-600">$50K+</p>
                <p className="text-sm text-slate-600">Donated</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section ref={impactRef} className="py-20 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={impactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-medium mb-2 block">Our Impact</span>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How Your Purchase Helps</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              When you create a custom photo product with us, you&apos;re directly contributing 
              to poverty relief efforts around the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Basic Necessities',
                description: 'Your purchase helps provide food, clean water, and essential supplies to families in need.'
              },
              {
                icon: Users,
                title: 'Education Support',
                description: 'We fund educational programs that give children the opportunity for a brighter future.'
              },
              {
                icon: Sparkles,
                title: 'Healthcare Access',
                description: 'Part of every sale goes toward medical supplies and healthcare services in underserved communities.'
              }
            ].map((item, index) => (
              <motion.div
                key={item?.title ?? index}
                initial={{ opacity: 0, y: 30 }}
                animate={impactInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{item?.title}</h3>
                <p className="text-slate-600">{item?.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <Sparkles className="w-12 h-12 text-orange-400  mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Every photo product you create helps fight poverty. Start shopping and start giving.
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Shop Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
