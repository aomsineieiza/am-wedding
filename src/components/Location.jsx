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
    <section id="location" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F7F4EF]/60">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
          >
            The Destination
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
          >
            Location &amp; Directions
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
          />
        </div>

        {/* Venue Information Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xl shadow-[#2D2926]/5 space-y-6"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#A38F70] font-medium">
                Wedding Venue
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2926] mt-1 font-normal">
                {venue.name}
              </h3>
              <p className="font-serif italic text-sm text-[#C8B89E] mt-0.5">{venue.hall}</p>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#6B635B] font-light">
              <p className="leading-relaxed">{venue.address}</p>
              <p className="font-serif text-xs text-[#A38F70]">{venue.thaiAddress}</p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-sans tracking-wider uppercase hover:bg-[#A38F70] transition-colors shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C8B89E]" />
                <span>Google Maps</span>
              </a>

              <a
                href={venue.appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#E8E2D8] text-[#2D2926] text-xs font-sans tracking-wider uppercase hover:border-[#C8B89E] transition-colors shadow-xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C8B89E]" />
                <span>Apple Maps</span>
              </a>

              <button
                type="button"
                onClick={copyAddress}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#2D2926] text-xs font-sans tracking-wider uppercase hover:border-[#C8B89E] transition-colors"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C8B89E]" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <a
                href={`tel:${venue.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] text-[#2D2926] text-xs font-sans tracking-wider uppercase hover:border-[#C8B89E] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C8B89E]" />
                <span>Call Venue</span>
              </a>
            </div>

            {/* Parking & Transportation Info */}
            <div className="pt-6 border-t border-[#E8E2D8] space-y-4">
              <div className="flex items-start gap-3 text-xs text-[#6B635B]">
                <Car className="w-4 h-4 text-[#C8B89E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2D2926] block mb-0.5">Valet &amp; On-Site Parking</strong>
                  <p className="font-light">Complimentary valet parking available on arrival with 250 covered bays.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-[#6B635B]">
                <Train className="w-4 h-4 text-[#C8B89E] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#2D2926] block mb-0.5">BTS Skytrain Shuttle</strong>
                  <p className="font-light">BTS Thong Lo Station (Exit 3). Private wedding shuttle runs every 15 minutes.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Interactive Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-white p-2.5 rounded-3xl border border-[#E8E2D8] shadow-xl shadow-[#2D2926]/5 overflow-hidden"
          >
            <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden relative bg-[#FAF8F5]">
              <iframe
                title="Wedding Venue Map"
                src={venue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] contrast-[105%]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
