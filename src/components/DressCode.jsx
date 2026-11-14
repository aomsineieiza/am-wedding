import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Sparkles, Shirt, ClipboardList, Heart } from 'lucide-react';
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
    <section id="dress-code" className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
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
            ธีมสีและการแต่งกาย
          </motion.h2>
          <p className="text-sm text-[#71717A] mt-2 font-normal">
            โทนสีแนะนำเพื่อความกลมกลืนและภาพถ่ายที่สวยงามร่วมกัน
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
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            {dressCode.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8 font-light">
            {dressCode.description}
          </p>

          {/* Color Palette Swatches */}
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">
              คลิกที่วงกลมสีเพื่อคัดลอกรหัสสี (HEX CODE)
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
                  <span className="mt-2.5 text-xs font-semibold text-slate-800">
                    {color.name}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {copiedHex === color.hex ? 'คัดลอกแล้ว!' : color.hex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Men & Women Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-6 border-t border-slate-200 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-slate-900 font-semibold text-sm">
                <Shirt className="w-4 h-4 text-[#0074E2]" />
                <span>สุภาพบุรุษ (Gentlemen)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                สูทสากล เบลเซอร์ หรือชุดสุภาพในโทนสีฟ้าหม่น (Dusty Blue), ฟ้าอ่อน, ขาวงาช้าง (Ivory), ครีม หรือน้ำตาลอ่อน (Light Brown)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1.5 text-slate-900 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-[#0074E2]" />
                <span>สุภาพสตรี (Ladies)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                ชุดเดรสสั้น/ยาว หรือชุดร่วมสมัยในโทนสีฟ้าหม่น (Dusty Blue), ฟ้าพาสเทล (Pastel Blue), ฟ้าอ่อน (Light Blue), ขาวงาช้าง, ครีม หรือน้ำตาลละมุน
              </p>
            </div>
          </div>

          {/* RSVP Prompt Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 max-w-lg mx-auto flex flex-col items-center text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EBF4FE] text-[#0074E2] flex items-center justify-center mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light mb-5">
              เพื่อให้การจัดเตรียมงานและที่นั่งเป็นไปอย่างราบรื่น<br />
              ขอความกรุณาแขกผู้มีเกียรติตอบรับการเข้าร่วมงานด้วยนะคะ
            </p>

            <a
              href="#rsvp"
              className="px-6 py-3 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current text-white/90" />
              <span>RSVP ตอบกลับคำเชิญ</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
