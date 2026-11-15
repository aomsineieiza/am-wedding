import React from 'react';
import { Calendar, MapPin, Heart, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileNav() {
  const { t } = useLanguage();

  const navItems = [
    { label: t('mobileNav.schedule', 'กำหนดการ'), href: '#schedule', icon: Calendar },
    { label: t('mobileNav.gallery', 'แกลเลอรี'), href: '#gallery', icon: ImageIcon },
    { label: t('mobileNav.dress', 'ธีมสี'), href: '#dress-code', icon: Sparkles },
    { label: t('mobileNav.location', 'สถานที่'), href: '#location', icon: MapPin },
    { label: t('mobileNav.rsvp', 'RSVP'), href: '#rsvp', icon: Heart, primary: true },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 sm:hidden w-[94vw] max-w-md"
    >
      <div className="bg-[#FAFAFB]/95 backdrop-blur-xl border border-[#E2E5E9] shadow-xl shadow-slate-900/10 rounded-full px-3 py-2 flex items-center justify-between">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          if (item.primary) {
            return (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#27272A] text-[#FAFAFB] text-xs font-semibold shadow-xs"
              >
                <Icon className="w-3.5 h-3.5 fill-current" />
                <span>RSVP</span>
              </a>
            );
          }
          return (
            <a
              key={idx}
              href={item.href}
              className="flex flex-col items-center justify-center p-1.5 text-[#71717A] hover:text-[#27272A] transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] mt-0.5 font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
