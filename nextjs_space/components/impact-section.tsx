"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

function AnimatedCounter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count?.toLocaleString?.() ?? '0'}{suffix}
    </span>
  );
}

export function ImpactSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { value: 15000, suffix: '+', label: 'Products Delivered' },
    { value: 50000, suffix: '+', label: 'Dollars Donated' },
    { value: 25, suffix: '+', label: 'Countries Reached' },
    { value: 5000, suffix: '+', label: 'Families Helped' }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-teal-200 font-medium mb-2 block">Our Impact</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Together, We Make a Difference
          </h2>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Every photo product you create contributes to a larger mission of helping those in need.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat?.label ?? index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
                <AnimatedCounter end={stat?.value ?? 0} suffix={stat?.suffix ?? ''} />
              </div>
              <p className="text-teal-100">{stat?.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
