import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

export default function DressCode() {
  const { lang, t } = useLanguage();
  const { dressCode } = weddingData;
  const [copiedHex, setCopiedHex] = useState(null);

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  return (
    <section id="dress-code" className="scroll-mt-24 py-10 sm:py-16 px-4 sm:px-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FAFAFB] text-[#52525B] text-[11px] font-medium tracking-[0.28em] uppercase mb-3 border border-[#E2E5E9]"
          >
            <span>DRESS CODE</span>
            <span className="text-[9px]">♥</span>
            <span>ATTIRE</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#27272A] tracking-tight"
          >
            {t('dressCode.title', 'ธีมสีและการแต่งกาย')}
          </motion.h2>
          <p className="text-sm text-[#71717A] mt-2 font-normal">
            {t('dressCode.subtitle', 'โทนสีแนะนำเพื่อความกลมกลืนและภาพถ่ายที่สวยงามร่วมกัน')}
          </p>
        </div>

        {/* Dress Code Card - Minimalist Matte Paper */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#FAFAFB] rounded-[32px] p-6 sm:p-10 border border-[#E2E5E9] shadow-[0_20px_50px_-15px_rgba(30,41,59,0.06),inset_0_1px_0_#FFFFFF] text-center"
        >
          {/* Color Palette Swatches */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">
              {lang === 'th' ? 'คลิกที่วงกลมสีเพื่อคัดลอกรหัสสี (HEX CODE)' : 'Click circle to copy hex code'}
            </p>
            <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
              {dressCode.palette.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => copyHex(color.hex)}
                  className="group w-24 sm:w-24 flex flex-col items-center focus:outline-none transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: color.hex }}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full shadow-sm border-2 border-white ring-1 ring-slate-200 relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md"
                  >
                    {copiedHex === color.hex ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  {/* Primary Color Name (Bold) */}
                  <span className="mt-2.5 text-xs font-semibold text-slate-800 leading-tight">
                    {lang === 'th' ? (color.nameThai || color.name) : color.name}
                  </span>

                  {/* Secondary Color Name (Thin / Light) */}
                  <span className="text-[11px] font-light text-slate-500 leading-tight">
                    {lang === 'th' ? color.name : (color.nameThai || color.name)}
                  </span>

                  {/* Hex Code / Copied Notice */}
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {copiedHex === color.hex ? (lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!') : color.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
