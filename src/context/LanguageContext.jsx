import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  th: {
    nav: {
      schedule: 'กำหนดการ',
      gallery: 'แกลเลอรี',
      dressCode: 'ธีมสีแต่งกาย',
      location: 'สถานที่',
      rsvp: 'RSVP ตอบรับ',
      envelope: 'ซองจดหมาย',
      audioTitle: 'เปิด/ปิดเพลงประกอบ',
      nowPlaying: 'กำลังเล่น',
      playMusic: 'เล่นเพลง',
      lightMode: 'โหมดสว่าง',
      darkMode: 'โหมดมืด',
    },
    envelope: {
      weddingOf: 'WEDDING INVITATION',
      openButton: 'เปิดการ์ดเชิญ',
      tapInstruction: 'แตะที่ผนึกหรือการ์ดเพื่อเปิดการ์ดเชิญ',
      introTitle: 'ขอเรียนเชิญร่วมเป็นเกียรติในงานฉลองมงคลสมรส',
      date: 'วันเสาร์ที่ 23 มกราคม 2570',
    },
    hero: {
      weAreGettingMarried: 'เรากำลังจะแต่งงานกัน',
      date: 'วันเสาร์ที่ 23 มกราคม 2570 • เลอปาสิริ (Le Pasiri)',
      countdownHeading: 'COUNTING DOWN TO OUR FOREVER',
      days: 'วัน',
      hours: 'ชม.',
      mins: 'นาที',
      secs: 'วินาที',
      rsvpButton: 'RSVP ตอบรับคำเชิญ',
      scheduleButton: 'ดูกำหนดการพิธี',
      scroll: 'เลื่อนลง',
    },
    timeline: {
      badge: 'TIMELINE & CEREMONY',
      title: 'กำหนดการพิธีมงคลสมรส',
      subtitle: 'ขอเรียนเชิญแขกผู้มีเกียรติทุกท่านร่วมเป็นสักขีพยานในวันสำคัญของเรา',
      morning: 'พิธีเช้า',
      evening: 'งานฉลองมงคลสมรส',
      addToCalendar: 'เพิ่มลงปฏิทิน',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple / Outlook (.ics)',
      addedSuccess: 'บันทึกลงปฏิทินเรียบร้อยแล้ว!',
      room: 'สถานที่',
      dressCodeTheme: 'ธีมสีการแต่งกาย',
    },
    gallery: {
      badge: 'MEMORIES & MOMENTS',
      title: 'บันทึกภาพความทรงจำ',
      subtitle: 'รวมภาพถ่ายพรีเวดดิ้งและความประทับใจของเราสองคน',
      openPhoto: 'แตะเพื่อดูภาพขนาดใหญ่',
      close: 'ปิด',
    },
    dressCode: {
      badge: 'ATTIRE & THEME',
      title: 'โทนสีการแต่งกาย',
      subtitle: 'ร่วมสร้างบรรยากาศแสนอบอุ่นในโทนสีฟ้าหม่น, ฟ้าพาสเทล, ฟ้าอ่อน, ขาวงาช้าง, น้ำตาลอ่อน และครีม',
      gentlemen: 'สุภาพบุรุษ',
      ladies: 'สุภาพสตรี',
      clickToCopy: 'แตะที่แถบสีเพื่อคัดลอกโค้ดสี',
      copied: 'คัดลอกโค้ดสีแล้ว',
    },
    location: {
      badge: 'VENUE & LOCATION',
      title: 'สถานที่จัดงาน & แผนที่',
      subtitle: 'การเดินทางและแผนที่สำหรับมาร่วมงาน',
      viewGoogleMaps: 'เปิดใน Google Maps',
      copyAddress: 'คัดลอกที่อยู่',
      copiedAddress: 'คัดลอกที่อยู่แล้ว',
      callVenue: 'โทรสอบถามเส้นทาง',
      parkingTitle: 'บริการที่จอดรถภายในโครงการ',
      parkingInfo: 'มีลานจอดรถกว้างขวางภายในบริเวณสถานที่จัดงาน พร้อมเจ้าหน้าที่ดูแลอำนวยความสะดวกตลอดงาน',
      transitTitle: 'การเดินทางและจุดสังเกต',
      transitInfo: 'ติดถนนนครอินทร์ (โซนพระราม 5 – ราชพฤกษ์) เดินทางสะดวกจากสะพานพระราม 5 ถนนราชพฤกษ์ และถนนกาญจนาภิเษก',
    },
    rsvp: {
      badge: 'RSVP INVITATION',
      title: 'ตอบรับคำเชิญร่วมงาน',
      subtitle: 'กรุณาแจ้งการเข้าร่วมงานล่วงหน้า เพื่อให้เราจัดเตรียมการต้อนรับอย่างอบอุ่นที่สุด',
      attendingPrompt: 'การเข้าร่วมงานของท่าน *',
      accept: 'ยินดีเข้าร่วมงาน (Joyfully Accept)',
      acceptDesc: 'พร้อมไปร่วมฉลองความสุข',
      decline: 'ขออภัย ไม่สะดวกเข้าร่วม (Decline)',
      declineDesc: 'ขอส่งกำลังใจร่วมยินดี',
      fullName: 'ชื่อ-นามสกุล (Full Name) *',
      fullNamePlaceholder: 'เช่น คุณกานต์ พิชญา',
      nickname: 'ชื่อเล่น (Nickname)',
      nicknamePlaceholder: 'เช่น กานต์',
      phone: 'เบอร์โทรศัพท์ (Phone Number) *',
      phonePlaceholder: '0xx-xxx-xxxx',
      guestCount: 'จำนวนผู้เข้าร่วมงาน (Guests Count)',
      guestCountPrompt: 'กรุณาเลือกจำนวนแขกที่มาร่วมงาน',
      customCountLabel: 'ระบุจำนวนผู้เข้าร่วมงานทั้งหมด (ท่าน) *',
      customCountHelper: 'ตั้งแต่ 5 ท่านขึ้นไป',
      wishes: 'คำอวยพรแด่คู่บ่าวสาว (Wishes for Aomsin & Mild)',
      wishesPlaceholder: 'พิมพ์ข้อความอวยพรคู่บ่าวสาวที่นี่...',
      submit: 'ส่งคำตอบรับ (Submit RSVP)',
      submitting: 'กำลังส่งข้อมูล...',
      successTitle: 'ขอบคุณมากค่ะ',
      successAcceptDesc: 'เราได้รับข้อมูลตอบรับเรียบร้อยแล้ว แล้วพบกันในวันสำคัญนะคะ!',
      successDeclineDesc: 'ขอบพระคุณสำหรับคำอวยพรและความระลึกถึงจากใจค่ะ',
      status: 'สถานะ',
      statusAccepted: 'ยินดีเข้าร่วมงาน',
      statusDeclined: 'ขออภัย ไม่สะดวกเข้าร่วม',
      guestsTotal: 'จำนวนแขก',
      done: 'เสร็จสิ้น',
      unitPerson: 'ท่าน',
    },
    registry: {
      badge: 'GIFT & BLESSING',
      title: 'ของขวัญและคำอวยพร',
      subtitle: 'หากท่านประสงค์จะมอบของขวัญแด่คู่บ่าวสาว สามารถร่วมอวยพรได้ผ่านบัญชีด้านล่างนี้',
      promptPay: 'พร้อมเพย์',
      accountNumber: 'เลขที่บัญชี',
      accountName: 'ชื่อบัญชี',
      copy: 'คัดลอก',
      copied: 'คัดลอกแล้ว',
    },
    footer: {
      quote: 'ขอบคุณที่ร่วมเป็นส่วนหนึ่งของเรื่องราวความรักของเรา',
      allRights: 'สงวนลิขสิทธิ์',
      backToTop: 'กลับสู่ด้านบน',
    },
    mobileNav: {
      home: 'หน้าแรก',
      schedule: 'กำหนดการ',
      gallery: 'แกลเลอรี',
      dress: 'ธีมสี',
      location: 'สถานที่',
      rsvp: 'ตอบรับ',
    },
  },
  en: {
    nav: {
      schedule: 'Schedule',
      gallery: 'Gallery',
      dressCode: 'Dress Code',
      location: 'Location',
      rsvp: 'RSVP Now',
      envelope: 'Envelope',
      audioTitle: 'Toggle Background Music',
      nowPlaying: 'Now Playing',
      playMusic: 'Play Music',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
    },
    envelope: {
      weddingOf: 'WEDDING INVITATION',
      openButton: 'Open Invitation',
      tapInstruction: 'Tap the wax seal or card to open invitation',
      introTitle: 'Together with our families, we joyfully invite you',
      date: 'Saturday, January 23, 2027',
    },
    hero: {
      weAreGettingMarried: 'WE ARE GETTING MARRIED',
      date: 'Saturday, January 23, 2027 • Le Pasiri',
      countdownHeading: 'COUNTING DOWN TO OUR FOREVER',
      days: 'DAYS',
      hours: 'HRS',
      mins: 'MINS',
      secs: 'SECS',
      rsvpButton: 'RSVP Confirmation',
      scheduleButton: 'View Schedule',
      scroll: 'SCROLL',
    },
    timeline: {
      badge: 'TIMELINE & CEREMONY',
      title: 'Wedding Day Schedule',
      subtitle: 'We warmly invite our honorable guests to witness our special day',
      morning: 'Morning Ceremony',
      evening: 'Evening Celebration',
      addToCalendar: 'Add to Calendar',
      googleCalendar: 'Google Calendar',
      appleCalendar: 'Apple / Outlook (.ics)',
      addedSuccess: 'Calendar file downloaded!',
      room: 'Hall',
      dressCodeTheme: 'Dress Code Theme',
    },
    gallery: {
      badge: 'MEMORIES & MOMENTS',
      title: 'Our Photo Gallery',
      subtitle: 'Capturing our unforgettable pre-wedding memories',
      openPhoto: 'Click photo to enlarge',
      close: 'Close',
    },
    dressCode: {
      badge: 'ATTIRE & THEME',
      title: 'Dress Code & Palette',
      subtitle: 'We kindly invite our beloved guests to dress in our signature wedding palette: Dusty Blue, Pastel Blue, Light Blue, Ivory, Light Brown & Cream',
      gentlemen: 'Gentlemen',
      ladies: 'Ladies',
      clickToCopy: 'Click any swatch to copy HEX code',
      copied: 'HEX code copied',
    },
    location: {
      badge: 'VENUE & LOCATION',
      title: 'Venue & Directions',
      subtitle: 'Maps, directions, and transit guide to our celebration',
      viewGoogleMaps: 'Open in Google Maps',
      copyAddress: 'Copy Address',
      copiedAddress: 'Address copied!',
      callVenue: 'Call Venue',
      parkingTitle: 'Parking Facilities',
      parkingInfo: 'Spacious on-site parking available with staff assistance throughout the event.',
      transitTitle: 'Getting There & Landmarks',
      transitInfo: 'Located on Nakhon In Road (Rama 5 – Ratchaphruek zone), easily accessible via Rama 5 Bridge and Kanchanaphisek Rd.',
    },
    rsvp: {
      badge: 'RSVP INVITATION',
      title: 'RSVP Confirmation',
      subtitle: 'Please kindly respond in advance so we can prepare our warmest welcome for you',
      attendingPrompt: 'Will you be attending? *',
      accept: 'Joyfully Accept',
      acceptDesc: 'Can’t wait to celebrate!',
      decline: 'Regretfully Decline',
      declineDesc: 'Wishing you all the best from afar',
      fullName: 'Full Name *',
      fullNamePlaceholder: 'e.g. John Doe',
      nickname: 'Nickname',
      nicknamePlaceholder: 'e.g. John',
      phone: 'Phone Number *',
      phonePlaceholder: '0xx-xxx-xxxx',
      guestCount: 'Number of Guests',
      guestCountPrompt: 'Please select number of attending guests',
      customCountLabel: 'Total Number of Guests *',
      customCountHelper: '5 guests or more',
      wishes: 'Wishes for Aomsin & Mild',
      wishesPlaceholder: 'Leave your lovely wishes for the couple here...',
      submit: 'Submit RSVP',
      submitting: 'Submitting...',
      successTitle: 'Thank You So Much',
      successAcceptDesc: 'We have received your confirmation. See you on our special day!',
      successDeclineDesc: 'Thank you so much for your warm wishes and blessing.',
      status: 'Status',
      statusAccepted: 'Joyfully Attending',
      statusDeclined: 'Decline with Love',
      guestsTotal: 'Guests Count',
      done: 'Done',
      unitPerson: 'Guests',
    },
    registry: {
      badge: 'GIFT & BLESSING',
      title: 'Wedding Gift & Registry',
      subtitle: 'Your presence is our greatest present. If you wish to send a gift, details are provided below.',
      promptPay: 'PromptPay',
      accountNumber: 'Account Number',
      accountName: 'Account Name',
      copy: 'Copy',
      copied: 'Copied',
    },
    footer: {
      quote: 'Thank you for being part of our love story.',
      allRights: 'All Rights Reserved',
      backToTop: 'Back to Top',
    },
    mobileNav: {
      home: 'Home',
      schedule: 'Schedule',
      gallery: 'Gallery',
      dress: 'Attire',
      location: 'Venue',
      rsvp: 'RSVP',
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('wedding_lang') === 'en' ? 'en' : 'th';
    } catch {
      return 'th';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wedding_lang', lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'th' ? 'en' : 'th'));
  };

  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[lang];
    for (const key of keys) {
      if (!current || typeof current !== 'object') return fallback;
      current = current[key];
    }
    return current !== undefined ? current : fallback;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
