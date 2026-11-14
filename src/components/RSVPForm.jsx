import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, CheckCircle2, User, Phone, Users, MessageSquare, AlertCircle, X, Sparkles, ChevronDown, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingData } from '../data/weddingData';

const GUEST_OPTIONS = [
  { value: '1', label: '1 ท่าน (เฉพาะตัวฉัน)', desc: 'เดินทางมาร่วมงาน 1 ท่าน' },
  { value: '2', label: '2 ท่าน (+ ผู้ติดตาม 1 ท่าน)', desc: 'มาร่วมงานพร้อมคู่รักหรือผู้ติดตาม' },
  { value: '3', label: '3 ท่าน', desc: 'กลุ่มเพื่อนหรือครอบครัว 3 ท่าน' },
  { value: '4', label: '4 ท่าน (ครอบครัว)', desc: 'มาร่วมงานพร้อมครอบครัว 4 ท่าน' },
];

export default function RSVPForm() {
  const { couple } = weddingData;
  const successDialogRef = useRef(null);
  const guestSheetRef = useRef(null);
  const desktopDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    attending: 'yes',
    guestCount: '1',
    dietary: '',
    wishes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
        setIsDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedGuestOption =
    GUEST_OPTIONS.find((opt) => String(opt.value) === String(formData.guestCount)) || GUEST_OPTIONS[0];

  const handleGuestDropdownClick = () => {
    if (window.innerWidth < 640) {
      if (guestSheetRef.current) {
        guestSheetRef.current.showModal();
      }
    } else {
      setIsDesktopDropdownOpen((prev) => !prev);
    }
  };

  const handleSelectGuestCount = (val) => {
    setFormData((prev) => ({ ...prev, guestCount: String(val) }));
    setIsDesktopDropdownOpen(false);
    if (guestSheetRef.current && guestSheetRef.current.open) {
      guestSheetRef.current.close();
    }
  };

  const handleGuestSheetBackdropClick = (e) => {
    if (!guestSheetRef.current) return;
    const rect = guestSheetRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      guestSheetRef.current.close();
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'กรุณาระบุชื่อ-นามสกุล';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'กรุณาระบุเบอร์โทรศัพท์หรืออีเมล';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData });

      try {
        const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        stored.push({
          ...formData,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('wedding_rsvps', JSON.stringify(stored));
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
    }, 600);
  };

  const closeSuccessModal = () => {
    if (successDialogRef.current) {
      successDialogRef.current.close();
    }
    setFormData({
      fullName: '',
      contact: '',
      attending: 'yes',
      guestCount: 1,
      dietary: '',
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
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FAFAFB] text-[#52525B] text-[11px] font-medium tracking-[0.28em] uppercase mb-3 border border-[#E2E5E9]"
          >
            <span>RSVP</span>
            <span className="text-[9px]">♥</span>
            <span>INVITATION</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#27272A] tracking-tight"
          >
            แบบฟอร์มตอบรับคำเชิญ
          </motion.h2>
          <p className="text-sm text-[#71717A] mt-2 font-normal">
            กรุณาตอบรับคำเชิญภายในวันที่ 31 ตุลาคม 2569 เพื่อความสะดวกในการจัดเตรียมที่นั่ง
          </p>
        </div>

        {/* RSVP Card - Minimalist Matte Paper */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#FAFAFB] rounded-[32px] p-6 sm:p-12 border border-[#E2E5E9] shadow-[0_20px_50px_-15px_rgba(30,41,59,0.06),inset_0_1px_0_#FFFFFF]"
        >
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Attendance Toggle Radio Cards */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                การเข้าร่วมงาน *
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
                      ยินดีเข้าร่วมงาน (Joyfully Accept)
                    </span>
                    <span className="text-xs text-slate-500">พร้อมไปร่วมฉลองความสุข</span>
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
                      ขออภัย ไม่สะดวกเข้าร่วม (Decline)
                    </span>
                    <span className="text-xs text-slate-500">ขอส่งกำลังใจร่วมยินดี</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                ชื่อ-นามสกุล (Full Name) *
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="เช่น คุณกานต์ พิชญา"
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

            {/* Contact */}
            <div>
              <label
                htmlFor="contact"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                เบอร์โทรศัพท์ หรือ อีเมล (Contact Info) *
              </label>
              <div className="relative">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="เช่น 081-234-5678"
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] focus:border-transparent transition-all ${
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div ref={desktopDropdownRef} className="relative">
                  <label
                    id="guestCount-label"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                  >
                    จำนวนผู้เข้าร่วมงาน (Guests Count)
                  </label>
                  <button
                    type="button"
                    aria-labelledby="guestCount-label"
                    aria-haspopup="listbox"
                    aria-expanded={isDesktopDropdownOpen}
                    onClick={handleGuestDropdownClick}
                    className="w-full px-4 py-3 pl-11 pr-10 rounded-xl bg-white border border-slate-200 hover:border-[#0074E2] text-sm text-slate-900 text-left focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all relative flex items-center justify-between cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <span className="truncate font-medium">{selectedGuestOption.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
                        isDesktopDropdownOpen ? 'rotate-180 text-[#0074E2]' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Floating Dropdown Menu (sm and up) */}
                  <AnimatePresence>
                    {isDesktopDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        role="listbox"
                        className="hidden sm:block absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 p-1.5 z-30"
                      >
                        {GUEST_OPTIONS.map((opt) => {
                          const isSelected = String(formData.guestCount) === String(opt.value);
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleSelectGuestCount(opt.value)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#EBF4FE] text-[#0074E2] font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <div className="text-sm">{opt.label}</div>
                                <div className="text-[11px] text-slate-400 font-normal">{opt.desc}</div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-[#0074E2] shrink-0" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label
                    htmlFor="dietary"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                  >
                    ข้อจำกัดด้านอาหาร (Dietary Restrictions)
                  </label>
                  <input
                    id="dietary"
                    name="dietary"
                    type="text"
                    value={formData.dietary}
                    onChange={handleChange}
                    placeholder="เช่น มังสวิรัติ, ฮาลาล, แพ้อาหารทะเล"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Wishes */}
            <div>
              <label
                htmlFor="wishes"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
              >
                คำอวยพรแด่คู่บ่าวสาว (Wishes for Aomsin &amp; Mild)
              </label>
              <div className="relative">
                <textarea
                  id="wishes"
                  name="wishes"
                  rows="3"
                  value={formData.wishes}
                  onChange={handleChange}
                  placeholder="พิมพ์ข้อความอวยพรคู่บ่าวสาวที่นี่..."
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
                  <span>กำลังส่งข้อมูล...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ยืนยันการตอบรับคำเชิญ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Mobile Bottom Sheet for Guest Count Dropdown */}
      <dialog
        ref={guestSheetRef}
        aria-labelledby="guest-sheet-title"
        closedby="any"
        onClick={handleGuestSheetBackdropClick}
        className="bottom-sheet-dialog fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-full bg-transparent p-0 border-0 outline-none backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl pt-3 pb-8 px-5 border-t border-slate-200 shadow-2xl"
        >
          {/* Bottom Sheet Pill Handle */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mb-4" />

          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EBF4FE] text-[#0074E2] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 id="guest-sheet-title" className="text-base font-bold text-slate-900">
                  เลือกจำนวนผู้เข้าร่วมงาน
                </h3>
                <p className="text-[11px] text-slate-500">Select number of attending guests</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => guestSheetRef.current?.close()}
              aria-label="Close bottom sheet"
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {GUEST_OPTIONS.map((opt) => {
              const isSelected = String(formData.guestCount) === String(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelectGuestCount(opt.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0074E2] bg-[#EBF4FE]/70 ring-2 ring-[#0074E2]/15'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-semibold ${isSelected ? 'text-[#0074E2]' : 'text-slate-900'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#0074E2] border-[#0074E2] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </dialog>

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
              ขอบคุณมากค่ะ, {submittedData.fullName}!
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              {submittedData.attending === 'yes'
                ? 'เราได้รับข้อมูลตอบรับเรียบร้อยแล้ว แล้วพบกันในวันสำคัญนะคะ!'
                : 'ขอบพระคุณสำหรับคำอวยพรและความระลึกถึงจากใจค่ะ'}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2 mb-6 text-left border border-slate-200">
              <p>
                <strong>สถานะ:</strong>{' '}
                <span className="text-[#0074E2] font-semibold">
                  {submittedData.attending === 'yes' ? 'ยินดีเข้าร่วมงาน' : 'ขออภัย ไม่สะดวกเข้าร่วม'}
                </span>
              </p>
              {submittedData.attending === 'yes' && (
                <p>
                  <strong>จำนวนแขก:</strong> {submittedData.guestCount} ท่าน
                </p>
              )}
              {submittedData.dietary && (
                <p>
                  <strong>ข้อจำกัดอาหาร:</strong> {submittedData.dietary}
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
              เสร็จสิ้น
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
