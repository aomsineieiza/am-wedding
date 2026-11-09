import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, CalendarPlus, Check, Sun, Moon, Clock } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Timeline() {
  const { schedule, couple, venue } = weddingData;
  const [activeTab, setActiveTab] = useState(schedule[0].id);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const getGoogleCalendarUrl = (item) => {
    const isMorning = item.id === 'morning-ceremony';
    const startDate = isMorning ? '20261128T003000Z' : '20261128T103000Z';
    const endDate = isMorning ? '20261128T043000Z' : '20261128T160000Z';
    const title = encodeURIComponent(`${couple.bride} & ${couple.groom}'s Wedding — ${item.period}`);
    const details = encodeURIComponent(`${item.periodThai}\nVenue: ${venue.name} (${item.venueRoom})\nDress Code: ${item.dressCodeNote}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = (item) => {
    const isMorning = item.id === 'morning-ceremony';
    const dtStart = isMorning ? '20261128T073000' : '20261128T173000';
    const dtEnd = isMorning ? '20261128T113000' : '20261128T230000';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AM Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${couple.bride} & ${couple.groom}'s Wedding — ${item.period}`,
      `DESCRIPTION:${item.periodThai} at ${venue.name}. Dress Code: ${item.dressCodeNote}`,
      `LOCATION:${venue.name}, ${venue.address}`,
      `DTSTART;TZID=Asia/Bangkok:${dtStart}`,
      `DTEND;TZID=Asia/Bangkok:${dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${couple.bride}-${couple.groom}-wedding-${item.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  const currentSchedule = schedule.find((s) => s.id === activeTab) || schedule[0];

  return (
    <section id="schedule" className="py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>SCHEDULE &amp; TIMELINE</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
        >
          กำหนดการและลำดับพิธี
        </motion.h2>
        <p className="text-sm text-slate-500 mt-2 font-normal">
          ร่วมเป็นเกียรติและสักขีพยานในทุกช่วงเวลาแห่งความสุข
        </p>
      </div>

      {/* Fastwork-Style Segmented Control Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200">
          {schedule.map((item) => {
            const isActive = activeTab === item.id;
            const isMorning = item.id === 'morning-ceremony';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0074E2] shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isMorning ? (
                  <Sun className={`w-4 h-4 ${isActive ? 'text-[#0074E2]' : 'text-slate-500'}`} />
                ) : (
                  <Moon className={`w-4 h-4 ${isActive ? 'text-[#0074E2]' : 'text-slate-500'}`} />
                )}
                <span>{item.periodThai} • {item.period}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Schedule Card - Fastwork Elevation & Border */}
      <motion.div
        key={currentSchedule.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl shadow-slate-900/5"
      >
        {/* Card Header & Venue Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF4FE] text-[#0074E2] font-semibold border border-[#C4DDFB]">
                {currentSchedule.time}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentSchedule.periodThai}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              {currentSchedule.period}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#0074E2]" />
              <span>{currentSchedule.venueRoom}</span>
            </div>
          </div>

          {/* Calendar Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={getGoogleCalendarUrl(currentSchedule)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-50 hover:bg-[#EBF4FE] hover:text-[#0074E2] border border-slate-200 hover:border-[#C4DDFB] text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#0074E2]" />
              <span>Google Cal</span>
            </a>
            <button
              type="button"
              onClick={() => downloadIcsFile(currentSchedule)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer"
            >
              {calendarAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>บันทึกแล้ว!</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Apple / iCal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {currentSchedule.items.map((item, idx) => {
            let iconEmoji = "✨";
            if (item.title.includes("Monk") || item.desc.includes("สงฆ์")) iconEmoji = "🙏";
            else if (item.title.includes("Khan Maak") || item.desc.includes("ขันหมาก")) iconEmoji = "🌺";
            else if (item.title.includes("Ring") || item.desc.includes("แหวน")) iconEmoji = "💍";
            else if (item.title.includes("Water") || item.desc.includes("หลั่งน้ำ")) iconEmoji = "🐚";
            else if (item.title.includes("Cake") || item.desc.includes("เค้ก")) iconEmoji = "🎂";
            else if (item.title.includes("Toast") || item.title.includes("Cocktail")) iconEmoji = "🥂";
            else if (item.title.includes("Party") || item.desc.includes("ปาร์ตี้")) iconEmoji = "🎶";

            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-[#C4DDFB] hover:bg-[#EBF4FE]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xl shrink-0">
                  {iconEmoji}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="text-base font-bold text-[#0074E2] font-mono">
                      {item.time}
                    </span>
                    <h4 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dress code note */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0074E2]" />
            <span>Dress Code Note: <strong className="text-slate-900">{currentSchedule.dressCodeNote}</strong></span>
          </div>
          <a href="#dress-code" className="text-[#0074E2] hover:underline font-semibold">
            ดูธีมสี &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
}
