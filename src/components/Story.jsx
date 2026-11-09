import React from 'react';
import { motion } from 'framer-motion';
import { weddingData } from '../data/weddingData';

export default function Story() {
  const { story } = weddingData;

  return (
    <section id="story" className="py-20 sm:py-28 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-16 sm:mb-24">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
        >
          Our Journey
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
        >
          How Our Story Unfolded
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
        />
      </div>

      {/* Alternating Photo & Story Grid */}
      <div className="space-y-16 sm:space-y-24">
        {story.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className={`flex flex-col ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-8 md:gap-14`}
            >
              {/* Photo Frame */}
              <div className="w-full md:w-1/2">
                <div className="relative p-2 bg-white rounded-2xl shadow-lg shadow-[#2D2926]/5 border border-[#E8E2D8] group overflow-hidden">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-serif tracking-widest text-[#2D2926] font-medium shadow-xs">
                      {item.year}
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <span className="font-serif text-3xl sm:text-4xl text-[#C8B89E] italic block mb-1">
                  0{index + 1}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2926] font-normal mb-2">
                  {item.title}
                </h3>
                <p className="text-xs uppercase tracking-wider text-[#A38F70] font-medium mb-4">
                  {item.subtitle}
                </p>
                <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed font-sans font-light">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

