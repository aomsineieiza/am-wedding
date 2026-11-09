import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Copy, Check, Car, Train } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Location() {
  const { venue } = weddingData;
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(`${venue.name}, ${venue.address}`);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  return (
    <section id="location" className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 bg-transparent">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>VENUE &amp; DIRECTIONS</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
          >
            สถานที่จัดงานและการเดินทาง
          </motion.h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            แผนที่ ข้อมูลที่จอดรถ และการเดินทางโดยรถไฟฟ้า BTS
          </p>
        </div>

        {/* Venue Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Details Column */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-900/5 space-y-6"
          >
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0074E2] bg-[#EBF4FE] px-2.5 py-1 rounded-full border border-[#C4DDFB]">
                Wedding Venue
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-3">
                {venue.name}
              </h3>
              <p className="text-sm font-medium text-slate-600 mt-0.5">{venue.hall}</p>
            </div>

            <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-light">
              <p className="leading-relaxed">{venue.address}</p>
              <p className="text-xs text-slate-500">{venue.thaiAddress}</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>

              <a
                href={venue.appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#0074E2] hover:text-[#0074E2] text-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0074E2]" />
                <span>Apple Maps</span>
              </a>

              <button
                type="button"
                onClick={copyAddress}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-all cursor-pointer"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>คัดลอกที่อยู่แล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>คัดลอกที่อยู่</span>
                  </>
                )}
              </button>

              <a
                href={`tel:${venue.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>โทรติดต่อสถานที่</span>
              </a>
            </div>

            {/* Parking & Transportation */}
            <div className="pt-5 border-t border-slate-100 space-y-3.5">
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Car className="w-4 h-4 text-[#0074E2] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">บริการ Valet &amp; ที่จอดรถ</strong>
                  <p className="font-light">มีบริการ Valet Parking ฟรี รองรับรถยนต์ได้มากกว่า 250 คัน</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-600">
                <Train className="w-4 h-4 text-[#0074E2] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-0.5">รถไฟฟ้า BTS รถตู้รับ-ส่ง</strong>
                  <p className="font-light">BTS สถานีทองหล่อ (ทางออก 3) มีรถ Shuttle Van ออกทุกๆ 15 นาที</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white p-2.5 rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden"
          >
            <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden relative bg-slate-100">
              <iframe
                title="Wedding Venue Map"
                src={venue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
