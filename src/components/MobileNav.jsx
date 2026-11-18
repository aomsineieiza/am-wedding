import React from 'react';
import { Calendar, MapPin, Heart, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MobileNav() {
  const { t } = useLanguage();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { label: t('mobileNav.schedule', 'กำหนดการ'), href: '#schedule', icon: Calendar },
    { label: t('mobileNav.dress', 'ธีมสี'), href: '#dress-code', icon: Sparkles },
    { label: t('mobileNav.gallery', 'แกลเลอรี'), href: '#gallery', icon: ImageIcon },
    { label: t('mobileNav.location', 'สถานที่'), href: '#location', icon: MapPin },
    { label: t('mobileNav.rsvp', 'RSVP'), href: '#rsvp', icon: Heart, primary: true },
  ];

  return (
    <nav
      aria-label="Mobile quick navigation"
      style={{ transform: 'translate3d(-50%, 0, 0)', willChange: 'transform' }}
      className="fixed bottom-4 left-1/2 z-40 sm:hidden w-[94vw] max-w-md"
    >
      <div className="bg-white/70 dark:bg-[#16191F]/70 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)] rounded-full px-3 py-2 flex items-center justify-between">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          if (item.primary) {
            return (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold shadow-xs active:scale-95 transition-transform"
              >
                <Icon className="w-3.5 h-3.5 fill-current text-white" />
                <span>RSVP</span>
              </a>
            );
          }
          return (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="flex flex-col items-center justify-center p-1.5 text-[#71717A] hover:text-[#27272A] transition-colors active:scale-95"
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
