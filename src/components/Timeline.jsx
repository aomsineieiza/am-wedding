import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Sparkles, CalendarPlus, Check, Sun, Moon, Clock } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { CeremonyAnimatedIcon } from './TimelineIcons';
import { useLanguage } from '../context/LanguageContext';

export default function Timeline() {
  const { lang, t } = useLanguage();
  const { schedule, couple, venue } = weddingData;
  const [activeTab, setActiveTab] = useState(schedule[0].id);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const getGoogleCalendarUrl = (item) => {
    const isMorning = item.id === 'morning-ceremony';
    const startDate = isMorning ? '20270123T003000Z' : '20270123T103000Z';
    const endDate = isMorning ? '20270123T043000Z' : '20270123T160000Z';
    const title = encodeURIComponent(`${couple.bride} & ${couple.groom}'s Wedding — ${item.period}`);
    const details = encodeURIComponent(`${item.periodThai}\nVenue: ${venue.name} (${item.venueRoom})\nDress Code: ${item.dressCodeNote}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const downloadIcsFile = (item) => {
    const isMorning = item.id === 'morning-ceremony';
    const dtStart = isMorning ? '20270123T073000' : '20270123T173000';
    const dtEnd = isMorning ? '20270123T113000' : '20270123T230000';

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
    <section id="schedule" className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FAFAFB] text-[#52525B] text-[11px] font-medium tracking-[0.28em] uppercase mb-3 border border-[#E2E5E9]"
        >
          <span>SCHEDULE</span>
          <span className="text-[9px]">♥</span>
          <span>TIMELINE</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-[#27272A] tracking-tight"
        >
          {t('timeline.title', 'กำหนดการและลำดับพิธี')}
        </motion.h2>
        <p className="text-sm text-[#71717A] mt-2 font-normal">
          {t('timeline.subtitle', 'ร่วมเป็นเกียรติและสักขีพยานในทุกช่วงเวลาแห่งความสุข')}
        </p>
      </div>

      {/* Minimalist Segmented Control Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-full bg-[#E5E8EC] border border-[#D8DCE2] max-w-full">
          {schedule.map((item) => {
            const isActive = activeTab === item.id;
            const isMorning = item.id === 'morning-ceremony';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#FAFAFB] text-[#27272A] shadow-xs border border-[#E2E5E9]'
                    : 'text-[#52525B] hover:text-[#27272A]'
                }`}
              >
                {isMorning ? (
                  <Sun className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#27272A]' : 'text-[#71717A]'}`} />
                ) : (
                  <Moon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#27272A]' : 'text-[#71717A]'}`} />
                )}
                <span>{lang === 'th' ? item.periodThai : item.period}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Schedule Card - Minimalist Matte Paper */}
      <motion.div
        key={currentSchedule.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FAFAFB] rounded-[32px] p-6 sm:p-10 border border-[#E2E5E9] shadow-[0_20px_50px_-15px_rgba(30,41,59,0.06),inset_0_1px_0_#FFFFFF]"
      >
        {/* Card Header & Venue Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E2E5E9] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EBF3F7] text-[#5C7A94] font-semibold border border-[#C8DCE8]">
                {currentSchedule.time}
              </span>
              <span className="text-xs text-[#71717A] font-medium">
                {lang === 'th' ? currentSchedule.periodThai : currentSchedule.period}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#27272A]">
              {lang === 'th' ? currentSchedule.periodThai : currentSchedule.period}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#71717A] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#7A98B3]" />
              <span>{currentSchedule.venueRoom}</span>
            </div>
          </div>

          {/* Calendar Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={getGoogleCalendarUrl(currentSchedule)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#EBF3F7] hover:text-[#5C7A94] border border-[#E2E5E9] hover:border-[#C8DCE8] text-xs font-medium text-[#3F3F46] transition-colors shadow-2xs"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#7A98B3]" />
              <span>Google Cal</span>
            </a>
            <button
              type="button"
              onClick={() => downloadIcsFile(currentSchedule)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#27272A] hover:bg-[#18181B] text-xs font-medium text-[#FAFAFB] transition-colors shadow-2xs cursor-pointer"
            >
              {calendarAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'บันทึกแล้ว!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-3.5 h-3.5 text-[#A7C7E7]" />
                  <span>Apple / iCal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timeline Items with Animated Lottie-Style Vector Icons */}
        <div className="space-y-4">
          {currentSchedule.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#E2E5E9] hover:border-[#A7C7E7] hover:bg-[#F5F9FC] transition-all duration-300 shadow-2xs"
            >
              {/* Animated Lottie-Style Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-[#FAFAFB] border border-[#E2E5E9] group-hover:border-[#A7C7E7] shadow-2xs group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all">
                <CeremonyAnimatedIcon title={item.title} desc={item.desc} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="font-editorial-serif text-lg font-semibold text-[#5C7A94] tracking-wider">
                    {item.time}
                  </span>
                  <h4 className="text-base font-semibold text-[#27272A] group-hover:text-[#5C7A94] transition-colors">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-[#71717A] mt-0.5 font-normal leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dress code note */}
        <div className="mt-8 pt-6 border-t border-[#E2E5E9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#52525B] bg-white p-4 rounded-2xl border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7A98B3]" />
            <span>Dress Code Note: <strong className="text-[#27272A]">{currentSchedule.dressCodeNote}</strong></span>
          </div>
          <a href="#dress-code" className="text-[#5C7A94] hover:text-[#27272A] hover:underline font-semibold">
            ดูธีมสี &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
}
