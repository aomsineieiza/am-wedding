import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Story() {
  const { story } = weddingData;

  return (
    <section id="story" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>OUR LOVE JOURNEY</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
        >
          เส้นทางความรักของเรา
        </motion.h2>
        <p className="text-sm text-slate-500 mt-2 font-normal">
          เรื่องราวและความทรงจำอันแสนอบอุ่นในทุกช่วงเวลาสำคัญ
        </p>
      </div>

      {/* Fastwork Card Grid with Modern Elevation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {story.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-white rounded-3xl p-5 border border-slate-200 hover:border-[#C4DDFB] shadow-xs hover:shadow-xl hover:shadow-[#0074E2]/8 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Frame */}
            <div className="aspect-[16/10] rounded-2xl overflow-hidden relative mb-5 bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-slate-800 shadow-xs border border-white/40">
                <Calendar className="w-3.5 h-3.5 text-[#0074E2]" />
                <span>{item.year}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0074E2] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-medium text-[#0074E2] mt-0.5 mb-2">
                {item.subtitle}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
