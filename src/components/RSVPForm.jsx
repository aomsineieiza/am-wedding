import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, CheckCircle2, User, Phone, Users, MessageSquare, AlertCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingData } from '../data/weddingData';

export default function RSVPForm() {
  const { couple } = weddingData;
  const successDialogRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    attending: 'yes',
    guestCount: 1,
    wishes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const submittedAt = new Date().toISOString();
    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || formData.fullName.trim();
    const lastName = nameParts.slice(1).join(' ') || '-';
    const attendingText =
      formData.attending === 'yes' ? 'ยินดีเข้าร่วมงาน (Yes)' : 'ไม่สะดวกเข้าร่วม (No)';

    const payload = {
      type: 'RSVP',
      fullName: formData.fullName.trim(),
      firstName,
      lastName,
      nickname: '-',
      contact: formData.contact.trim(),
      phone: formData.contact.trim(),
      attending: attendingText,
      guestSide: attendingText,
      guestCount: formData.attending === 'yes' ? Number(formData.guestCount) : 0,
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
      setSubmittedData({ ...formData });

      try {
        const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        stored.push({
          ...formData,
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
      contact: '',
      attending: 'yes',
      guestCount: 1,
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4FE] text-[#0074E2] text-xs font-semibold mb-3 border border-[#C4DDFB]"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>RSVP INVITATION</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
          >
            แบบฟอร์มตอบรับคำเชิญ
          </motion.h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            กรุณาตอบรับคำเชิญภายในวันที่ 31 ตุลาคม 2569 เพื่อความสะดวกในการจัดเตรียมที่นั่ง
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
              <div className="pt-1">
                <label
                  htmlFor="guestCount"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
                >
                  จำนวนผู้เข้าร่วมงาน (Guests Count)
                </label>
                <div className="relative">
                  <select
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-11 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all"
                  >
                    <option value="1">1 ท่าน (เฉพาะตัวฉัน)</option>
                    <option value="2">2 ท่าน (+ ผู้ติดตาม 1 ท่าน)</option>
                    <option value="3">3 ท่าน</option>
                    <option value="4">4 ท่าน (ครอบครัว)</option>
                  </select>
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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
