import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, CheckCircle2, User, Phone, Users, MessageSquare, AlertCircle, X, Sparkles, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingData } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

const getGuestOptions = (lang = 'th') => [
  { value: 1, label: lang === 'th' ? '1 ท่าน' : '1 Guest', desc: lang === 'th' ? 'เฉพาะตัวฉัน' : 'Myself only', badge: '1' },
  { value: 2, label: lang === 'th' ? '2 ท่าน' : '2 Guests', desc: lang === 'th' ? '+ ผู้ติดตาม 1 ท่าน' : '+ 1 Guest', badge: '2' },
  { value: 3, label: lang === 'th' ? '3 ท่าน' : '3 Guests', desc: lang === 'th' ? '+ ผู้ติดตาม 2 ท่าน' : '+ 2 Guests', badge: '3' },
  { value: 4, label: lang === 'th' ? '4 ท่าน' : '4 Guests', desc: lang === 'th' ? '+ ผู้ติดตาม 3 ท่าน' : '+ 3 Guests', badge: '4' },
  { value: 'custom', label: lang === 'th' ? 'มากกว่า 4 ท่าน' : 'More than 4', desc: lang === 'th' ? 'กรุณาระบุจำนวน' : 'Please specify', badge: '5+' },
];

export default function RSVPForm() {
  const { lang, t } = useLanguage();
  const { couple } = weddingData;
  const guestOptions = getGuestOptions(lang);
  const successDialogRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    contact: '',
    attending: 'yes',
    guestCount: 1,
    isCustomGuestCount: false,
    customGuestCount: 5,
    wishes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isGuestSheetOpen, setIsGuestSheetOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef(null);

  useEffect(() => {
    if (isGuestSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGuestSheetOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
        setIsGuestDropdownOpen(false);
      }
    };
    if (isGuestDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGuestDropdownOpen]);

  const formatPhoneNumber = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'กรุณาระบุชื่อ-นามสกุล';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'กรุณาระบุเบอร์โทรศัพท์';
    } else {
      const digits = formData.contact.replace(/\D/g, '');
      if (digits.length < 9) {
        newErrors.contact = 'กรุณาระบุเบอร์โทรศัพท์ให้ครบถ้วน (เช่น 081-234-5678)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'contact' ? formatPhoneNumber(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const submittedAt = new Date().toISOString();
    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || formData.fullName.trim();
    const lastName = nameParts.slice(1).join(' ') || '-';
    const nicknameText = formData.nickname.trim() || '-';
    const attendingText =
      formData.attending === 'yes' ? 'ยินดีเข้าร่วมงาน (Yes)' : 'ไม่สะดวกเข้าร่วม (No)';

    const finalGuestCount =
      formData.attending === 'yes'
        ? formData.isCustomGuestCount
          ? Number(formData.customGuestCount) || 5
          : Number(formData.guestCount)
        : 0;

    const payload = {
      type: 'RSVP',
      fullName: formData.fullName.trim(),
      rawFullName: formData.fullName.trim(),
      firstName,
      lastName,
      nickname: nicknameText,
      contact: formData.contact.trim(),
      phone: formData.contact.trim(),
      attending: attendingText,
      guestSide: attendingText,
      guestCount: finalGuestCount,
      dietarySummary: '-',
      alcoholSummary: '-',
      wishes: formData.wishes.trim(),
      submittedAt,
    };

    if (weddingData.googleSheetWebAppUrl) {
      try {
        await fetch(weddingData.googleSheetWebAppUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error('Google Sheets sync error:', err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({
        ...formData,
        guestCount: finalGuestCount,
      });

      try {
        const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        stored.push({
          ...formData,
          guestCount: finalGuestCount,
          submittedAt,
        });
        localStorage.setItem('wedding_rsvps', JSON.stringify(stored));
        window.dispatchEvent(new Event('rsvp_updated'));
      } catch (err) {
        console.error('Storage error:', err);
      }

      if (formData.attending === 'yes') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#0074E2', '#38BDF8', '#F59E0B', '#10B981'],
        });
      }

      if (successDialogRef.current) {
        successDialogRef.current.showModal();
      }
    }, 400);
  };

  const closeSuccessModal = () => {
    if (successDialogRef.current) {
      successDialogRef.current.close();
    }
    setFormData({
      fullName: '',
      nickname: '',
      contact: '',
      attending: 'yes',
      guestCount: 1,
      isCustomGuestCount: false,
      customGuestCount: 5,
      wishes: '',
    });
  };

  const handleDialogBackdropClick = (e) => {
    if (!successDialogRef.current) return;
    const rect = successDialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      closeSuccessModal();
    }
  };

  const handleSelectGuestOption = (value) => {
    if (value === 'custom') {
      setFormData((prev) => ({
        ...prev,
        isCustomGuestCount: true,
        guestCount: Number(prev.customGuestCount) || 5,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        isCustomGuestCount: false,
        guestCount: value,
      }));
    }
  };

  const getSelectedGuestDisplay = () => {
    if (formData.isCustomGuestCount) {
      return {
        label: lang === 'th' ? 'มากกว่า 4 ท่าน' : 'More than 4',
        desc: `${formData.customGuestCount || 5} ${lang === 'th' ? 'ท่าน' : 'guests'}`,
      };
    }
    const found = guestOptions.find((opt) => Number(opt.value) === Number(formData.guestCount));
    return found || guestOptions[0];
  };

  const selectedGuestDisplay = getSelectedGuestDisplay();

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 bg-transparent">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{t('rsvp.badge', 'RSVP INVITATION')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
          >
            {t('rsvp.title', 'แบบฟอร์มตอบรับคำเชิญ')}
          </motion.h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            {t('rsvp.subtitle', 'กรุณาแจ้งการเข้าร่วมงานล่วงหน้า เพื่อให้เราจัดเตรียมการต้อนรับอย่างอบอุ่นที่สุด')}
          </p>
        </div>

        {/* RSVP Card - Fastwork Elevation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-50/70 rounded-3xl p-6 sm:p-12 border border-slate-200 shadow-xl shadow-slate-900/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Attendance Toggle Radio Cards */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                {t('rsvp.attendingPrompt', 'การเข้าร่วมงาน *')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.attending === 'yes'
                      ? 'border-[#0074E2] bg-[#EBF4FE]/60 ring-2 ring-[#0074E2]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="yes"
                    checked={formData.attending === 'yes'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.attending === 'yes'
                        ? 'border-[#0074E2] bg-[#0074E2]'
                        : 'border-slate-300'
                    }`}
                  >
                    {formData.attending === 'yes' && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {t('rsvp.accept', 'ยินดีเข้าร่วมงาน (Joyfully Accept)')}
                    </span>
                    <span className="text-xs text-slate-500">{t('rsvp.acceptDesc', 'พร้อมไปร่วมฉลองความสุข')}</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.attending === 'no'
                      ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="no"
                    checked={formData.attending === 'no'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.attending === 'no'
                        ? 'border-slate-800 bg-slate-800'
                        : 'border-slate-300'
                    }`}
                  >
                    {formData.attending === 'no' && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {t('rsvp.decline', 'ขออภัย ไม่สะดวกเข้าร่วม (Decline)')}
                    </span>
                    <span className="text-xs text-slate-500">{t('rsvp.declineDesc', 'ขอส่งกำลังใจร่วมยินดี')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Full Name & Nickname */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  {t('rsvp.fullName', 'ชื่อ-นามสกุล (Full Name) *')}
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('rsvp.fullNamePlaceholder', 'เช่น คุณกานต์ พิชญา')}
                    className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] focus:border-transparent transition-all ${
                      errors.fullName ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                {errors.fullName && (
                  <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nickname"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  {t('rsvp.nickname', 'ชื่อเล่น (Nickname)')}
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder={t('rsvp.nicknamePlaceholder', 'เช่น กานต์')}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label
                htmlFor="contact"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                {t('rsvp.phone', 'เบอร์โทรศัพท์ (Phone Number) *')}
              </label>
              <div className="relative">
                <input
                  id="contact"
                  name="contact"
                  type="tel"
                  inputMode="numeric"
                  maxLength={12}
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder={t('rsvp.phonePlaceholder', '0xx-xxx-xxxx')}
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] focus:border-transparent transition-all tracking-wider ${
                    errors.contact ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'
                  }`}
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.contact && (
                <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.contact}</span>
                </p>
              )}
            </div>

            {/* Conditional fields if Attending */}
            {formData.attending === 'yes' && (
              <div className="pt-1">
                <label
                  htmlFor="guestCount"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  {t('rsvp.guestCount', 'จำนวนผู้เข้าร่วมงาน (Guests Count)')}
                </label>

                {/* Desktop: Custom Dropdown Menu with UI matching Bottom Sheet */}
                <div ref={desktopDropdownRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsGuestDropdownOpen((prev) => !prev)}
                    aria-expanded={isGuestDropdownOpen}
                    className="w-full px-4 py-3 pl-11 pr-4 rounded-xl bg-white dark:bg-[#1E2228] border border-slate-200 dark:border-[#323842] text-sm text-slate-900 dark:text-zinc-100 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all shadow-2xs hover:border-slate-300 dark:hover:border-[#424A56] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {selectedGuestDisplay.label}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">
                        ({selectedGuestDisplay.desc})
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isGuestDropdownOpen ? 'rotate-180 text-[#0074E2]' : ''
                      }`}
                    />
                  </button>
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

                  {/* Desktop Dropdown Popover */}
                  <AnimatePresence>
                    {isGuestDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-[#1E2228] rounded-2xl border border-slate-200 dark:border-[#2E3440] shadow-xl p-2.5 space-y-1.5"
                      >
                        {guestOptions.map((opt) => {
                          const isSelected =
                            opt.value === 'custom'
                              ? formData.isCustomGuestCount
                              : !formData.isCustomGuestCount && Number(formData.guestCount) === Number(opt.value);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                handleSelectGuestOption(opt.value);
                                setIsGuestDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#0074E2] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#0074E2]/15 ring-1 ring-[#0074E2]/25'
                                  : 'border-transparent hover:border-slate-200 dark:hover:border-[#323842] hover:bg-slate-50 dark:hover:bg-[#252A32]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-sm transition-colors shrink-0 ${
                                    isSelected
                                      ? 'bg-[#0074E2] dark:bg-[#38BDF8] text-white dark:text-slate-950 shadow-xs'
                                      : 'bg-slate-100 dark:bg-[#1A1D23] text-slate-700 dark:text-zinc-200'
                                  }`}
                                >
                                  {opt.badge || opt.value}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900 dark:text-zinc-100 text-sm leading-tight">
                                    {opt.label}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                                    {opt.desc}
                                  </div>
                                </div>
                              </div>

                              {/* Radio Circle Indicator */}
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mr-1 ${
                                  isSelected
                                    ? 'border-[#0074E2] dark:border-[#38BDF8]'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-[#0074E2] dark:bg-[#38BDF8]" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile: Interactive Bottom Sheet Trigger */}
                <div className="relative block sm:hidden">
                  <button
                    type="button"
                    onClick={() => setIsGuestSheetOpen(true)}
                    className="w-full px-4 py-3 pl-11 pr-4 rounded-xl bg-white dark:bg-[#1E2228] border border-slate-200 dark:border-[#323842] text-sm text-slate-900 dark:text-zinc-100 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all shadow-2xs active:bg-slate-50 dark:active:bg-[#252A32] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-zinc-100">
                        {selectedGuestDisplay.label}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">
                        ({selectedGuestDisplay.desc})
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Custom Guest Count Stepper Input (Shown when > 4 guests is selected) */}
                <AnimatePresence>
                  {formData.isCustomGuestCount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -4 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pt-3 border-t border-slate-100 dark:border-[#2C323C] overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="customGuestCount"
                          className="block text-xs font-semibold text-slate-700 dark:text-zinc-300"
                        >
                          {t('rsvp.customCountLabel', 'ระบุจำนวนผู้เข้าร่วมงานทั้งหมด (ท่าน) *')}
                        </label>
                        <span className="text-[11px] text-[#0074E2] dark:text-[#38BDF8] font-medium">
                          {t('rsvp.customCountHelper', 'ตั้งแต่ 5 ท่านขึ้นไป')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick Stepper - */}
                        <button
                          type="button"
                          onClick={() => {
                            const current = Number(formData.customGuestCount) || 5;
                            if (current > 5) {
                              setFormData((prev) => ({
                                ...prev,
                                customGuestCount: current - 1,
                                guestCount: current - 1,
                              }));
                            }
                          }}
                          disabled={(Number(formData.customGuestCount) || 5) <= 5}
                          className="w-11 h-11 rounded-xl border border-slate-200 dark:border-[#323842] bg-slate-50 dark:bg-[#252A32] text-slate-700 dark:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-[#2F3540] flex items-center justify-center font-bold text-lg transition-colors cursor-pointer shrink-0"
                        >
                          -
                        </button>

                        {/* Direct number input */}
                        <div className="relative flex-1">
                          <input
                            id="customGuestCount"
                            name="customGuestCount"
                            type="number"
                            min="5"
                            max="100"
                            value={formData.customGuestCount}
                            onChange={(e) => {
                              const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10) || 5);
                              setFormData((prev) => ({
                                ...prev,
                                customGuestCount: val,
                                guestCount: val || 5,
                              }));
                            }}
                            placeholder="5"
                            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E2228] border border-slate-200 dark:border-[#323842] text-sm font-semibold text-slate-900 dark:text-zinc-100 text-center focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                            {t('rsvp.unitPerson', 'ท่าน')}
                          </span>
                        </div>

                        {/* Quick Stepper + */}
                        <button
                          type="button"
                          onClick={() => {
                            const current = Number(formData.customGuestCount) || 5;
                            setFormData((prev) => ({
                              ...prev,
                              customGuestCount: current + 1,
                              guestCount: current + 1,
                            }));
                          }}
                          className="w-11 h-11 rounded-xl border border-slate-200 dark:border-[#323842] bg-slate-50 dark:bg-[#252A32] text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-[#2F3540] flex items-center justify-center font-bold text-lg transition-colors cursor-pointer shrink-0"
                        >
                          +
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Wishes */}
            <div>
              <label
                htmlFor="wishes"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                {t('rsvp.wishes', 'คำอวยพรแด่คู่บ่าวสาว (Wishes for Aomsin & Mild)')}
              </label>
              <div className="relative">
                <textarea
                  id="wishes"
                  name="wishes"
                  rows="3"
                  value={formData.wishes}
                  onChange={handleChange}
                  placeholder={t('rsvp.wishesPlaceholder', 'พิมพ์ข้อความอวยพรคู่บ่าวสาวที่นี่...')}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all resize-none"
                />
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('rsvp.submitting', 'กำลังส่งข้อมูล...')}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('rsvp.submit', 'ยืนยันการตอบรับคำเชิญ')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Modal using Native <dialog> */}
      <dialog
        ref={successDialogRef}
        aria-labelledby="rsvp-success-title"
        closedby="any"
        onClick={handleDialogBackdropClick}
        className="fixed inset-0 m-auto max-w-lg w-[90vw] bg-transparent p-0 rounded-3xl border-0 outline-none backdrop:bg-slate-950/70 backdrop:backdrop-blur-md"
      >
        {submittedData && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-2xl text-center relative"
          >
            <button
              type="button"
              onClick={closeSuccessModal}
              aria-label="Close confirmation card"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-[#EBF4FE] text-[#0074E2] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 id="rsvp-success-title" className="text-2xl font-bold text-slate-900 mb-2">
              {t('rsvp.successTitle', 'ขอบคุณมากค่ะ')}, {submittedData.fullName}
              {submittedData.nickname ? ` (${submittedData.nickname})` : ''}!
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              {submittedData.attending === 'yes'
                ? t('rsvp.successAcceptDesc', 'เราได้รับข้อมูลตอบรับเรียบร้อยแล้ว แล้วพบกันในวันสำคัญนะคะ!')
                : t('rsvp.successDeclineDesc', 'ขอบพระคุณสำหรับคำอวยพรและความระลึกถึงจากใจค่ะ')}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2 mb-6 text-left border border-slate-200">
              <p>
                <strong>{t('rsvp.status', 'สถานะ')}:</strong>{' '}
                <span className="text-[#0074E2] font-semibold">
                  {submittedData.attending === 'yes' ? t('rsvp.statusAccepted', 'ยินดีเข้าร่วมงาน') : t('rsvp.statusDeclined', 'ขออภัย ไม่สะดวกเข้าร่วม')}
                </span>
              </p>
              {submittedData.attending === 'yes' && (
                <p>
                  <strong>{t('rsvp.guestsTotal', 'จำนวนแขก')}:</strong> {submittedData.guestCount} {t('rsvp.unitPerson', 'ท่าน')}
                </p>
              )}
              {submittedData.wishes && (
                <p className="italic pt-2 border-t border-slate-200 text-slate-700">
                  &ldquo;{submittedData.wishes}&rdquo;
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full py-3 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              {t('rsvp.done', 'เสร็จสิ้น')}
            </button>
          </div>
        )}
      </dialog>

      {/* Mobile Bottom Sheet for Guest Count Selection */}
      <AnimatePresence>
        {isGuestSheetOpen && (
          <div className="fixed inset-0 z-50 sm:hidden flex items-end justify-center">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsGuestSheetOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="relative w-full max-h-[85vh] bg-white dark:bg-[#1E2228] rounded-t-3xl shadow-2xl z-10 flex flex-col overflow-hidden pb-6 border-t border-slate-200/60 dark:border-[#2E3440]"
            >
              {/* Drag Handle Indicator */}
              <div className="pt-3 pb-1.5 flex justify-center cursor-grab">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
              </div>

              {/* Sheet Header */}
              <div className="px-5 py-3 border-b border-slate-100 dark:border-[#2E3440] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EBF4FE] dark:bg-[#0074E2]/20 text-[#0074E2] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 leading-tight">
                      จำนวนผู้เข้าร่วมงาน
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      กรุณาเลือกจำนวนแขกที่มาร่วมงาน
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGuestSheetOpen(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#2A303C] hover:bg-slate-200 dark:hover:bg-[#363D4D] text-slate-500 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Options List */}
              <div className="p-4 pb-7 space-y-2.5 overflow-y-auto max-h-[60vh]">
                {guestOptions.map((opt) => {
                  const isSelected =
                    opt.value === 'custom'
                      ? formData.isCustomGuestCount
                      : !formData.isCustomGuestCount && Number(formData.guestCount) === Number(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        handleSelectGuestOption(opt.value);
                        setIsGuestSheetOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer ${
                        isSelected
                          ? 'border-[#0074E2] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#0074E2]/15 ring-2 ring-[#0074E2]/20'
                          : 'border-slate-200 dark:border-[#323842] hover:border-slate-300 dark:hover:border-[#424A56] bg-white dark:bg-[#252A32]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-base transition-colors shrink-0 ${
                            isSelected
                              ? 'bg-[#0074E2] dark:bg-[#38BDF8] text-white dark:text-slate-950 shadow-xs'
                              : 'bg-slate-100 dark:bg-[#1A1D23] text-slate-700 dark:text-zinc-200'
                          }`}
                        >
                          {opt.badge || opt.value}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                            {opt.label}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-zinc-400">
                            {opt.desc}
                          </div>
                        </div>
                      </div>

                      {/* Radio Circle Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          isSelected
                            ? 'border-[#0074E2] dark:border-[#38BDF8]'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0074E2] dark:bg-[#38BDF8]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
