import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Sparkles, CalendarPlus, Check, Sun, Moon } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Timeline() {
  const { schedule, couple, venue } = weddingData;
  const [activeTab, setActiveTab] = useState(schedule[0].id);
  const [calendarAdded, setCalendarAdded] = useState(false);

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (item) => {
    const isMorning = item.id === 'morning-ceremony';
    // Format: YYYYMMDDTHHMMSSZ
    const startDate = isMorning ? '20261128T003000Z' : '20261128T103000Z'; // UTC times corresponding to 07:30 and 17:30 BKK (UTC+7)
    const endDate = isMorning ? '20261128T043000Z' : '20261128T160000Z';
    const title = encodeURIComponent(`${couple.bride} & ${couple.groom}'s Wedding — ${item.period}`);
    const details = encodeURIComponent(`${item.periodThai}\nVenue: ${venue.name} (${item.venueRoom})\nDress Code: ${item.dressCodeNote}`);
    const location = encodeURIComponent(`${venue.name}, ${venue.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  // Download .ics file for Apple Calendar / Outlook / native phone calendars
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
      <div className="text-center max-w-xl mx-auto mb-14">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
        >
          Event Itinerary
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
        >
          Schedule of Celebrations
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
        />
      </div>

      {/* Morning / Evening Filter Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 rounded-full bg-[#EFE9DF]/80 border border-[#E8E2D8] shadow-inner">
          {schedule.map((item) => {
            const isActive = activeTab === item.id;
            const isMorning = item.id === 'morning-ceremony';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-5 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-sans tracking-wider uppercase transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-[#2D2926] shadow-sm font-medium border border-[#E8E2D8]'
                    : 'text-[#6B635B] hover:text-[#2D2926]'
                }`}
              >
                {isMorning ? (
                  <Sun className={`w-4 h-4 ${isActive ? 'text-[#C8B89E]' : 'text-[#6B635B]'}`} />
                ) : (
                  <Moon className={`w-4 h-4 ${isActive ? 'text-[#C8B89E]' : 'text-[#6B635B]'}`} />
                )}
                <span>{item.period}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Schedule Card */}
      <motion.div
        key={currentSchedule.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xl shadow-[#2D2926]/5 relative overflow-hidden"
      >
        {/* Card Header & Room Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#E8E2D8] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif italic text-2xl text-[#C8B89E]">
                {currentSchedule.periodThai}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#A38F70] border border-[#E8E2D8]">
                {currentSchedule.time}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2D2926] mt-1">
              {currentSchedule.period}
            </h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B635B] mt-2">
              <MapPin className="w-3.5 h-3.5 text-[#C8B89E]" />
              <span>{currentSchedule.venueRoom}</span>
            </div>
          </div>

          {/* Add to Calendar Action */}
          <div className="flex flex-wrap gap-2">
            <a
              href={getGoogleCalendarUrl(currentSchedule)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-white border border-[#E8E2D8] hover:border-[#C8B89E] text-xs font-sans tracking-wide text-[#2D2926] transition-colors shadow-xs"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#C8B89E]" />
              <span>Google Cal</span>
            </a>
            <button
              type="button"
              onClick={() => downloadIcsFile(currentSchedule)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2D2926] hover:bg-[#A38F70] text-xs font-sans tracking-wide text-white transition-colors shadow-xs"
            >
              {calendarAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-3.5 h-3.5 text-[#C8B89E]" />
                  <span>Apple / iCal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Vertical Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-[#E8E2D8]">
          {currentSchedule.items.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot Icon on Timeline */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#C8B89E] group-hover:bg-[#C8B89E] transition-colors duration-300" />

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="font-serif text-lg text-[#A38F70] font-medium tracking-wide">
                  {item.time}
                </span>
                <div>
                  <h4 className="font-serif text-lg sm:text-xl text-[#2D2926] font-normal">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B635B] mt-0.5 font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dress code reminder pill at bottom of card */}
        <div className="mt-10 pt-6 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#6B635B] bg-[#FAF8F5]/80 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8B89E]" />
            <span>Dress Code Note: <strong className="text-[#2D2926]">{currentSchedule.dressCodeNote}</strong></span>
          </div>
          <a href="#dress-code" className="text-[#A38F70] hover:underline font-medium">
            View Palette &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
}
