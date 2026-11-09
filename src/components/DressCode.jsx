import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Shirt } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function DressCode() {
  const { dressCode } = weddingData;
  const [copiedHex, setCopiedHex] = useState(null);

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  return (
    <section id="dress-code" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
          >
            Attire Inspiration
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
          >
            Dress Code &amp; Palette
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
          />
        </div>

        {/* Dress Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xl shadow-[#2D2926]/5"
        >
          {/* Theme Title */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-serif italic text-xl text-[#C8B89E] block mb-1">
              {dressCode.subtitle}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2926] font-normal mb-3">
              {dressCode.title}
            </h3>
            <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed font-light">
              {dressCode.description}
            </p>
          </div>

          {/* Interactive Color Palette Swatches */}
          <div className="mb-12">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-[#A38F70] mb-6 font-medium">
              Click any swatch to copy color code
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
              {dressCode.palette.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => copyHex(color.hex)}
                  className="group flex flex-col items-center focus:outline-none transition-transform hover:-translate-y-1"
                >
                  {/* Swatch Circle */}
                  <div
                    style={{ backgroundColor: color.hex }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-md border-2 border-white ring-1 ring-[#E8E2D8] relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                  >
                    {copiedHex === color.hex ? (
                      <Check className="w-5 h-5 text-emerald-600 animate-scale" />
                    ) : (
                      <Copy className="w-4 h-4 text-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Swatch Labels */}
                  <span className="mt-3 text-xs font-serif font-medium text-[#2D2926]">
                    {color.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#6B635B] mt-0.5">
                    {copiedHex === color.hex ? 'Copied!' : color.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Styling Guidelines for Guests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[#E8E2D8]">
            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8E2D8]/80">
              <div className="flex items-center gap-2 mb-2">
                <Shirt className="w-4 h-4 text-[#C8B89E]" />
                <h4 className="font-serif text-lg text-[#2D2926] font-medium">Gentlemen</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed font-light">
                Classic tailored suits in warm beige, charcoal, olive sage, or navy. Crisp white or ivory dress shirt with a subtle neutral tie or pocket square.
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl border border-[#E8E2D8]/80">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C8B89E]" />
                <h4 className="font-serif text-lg text-[#2D2926] font-medium">Ladies</h4>
              </div>
              <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed font-light">
                Floor-length gowns, elegant midi dresses, or refined modern Thai silk in champagne, muted taupe, rose blush, or sage green. (Kindly avoid solid bridal white).
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
