import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, CheckCircle2, User, Phone, Users, MessageSquare, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingData } from '../data/weddingData';

export default function RSVPForm() {
  const { couple } = weddingData;
  const successDialogRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    attending: 'yes', // 'yes' or 'no'
    guestCount: 1,
    dietary: '',
    wishes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Form Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }
    if (!formData.contact.trim()) {
      newErrors.contact = 'Please provide a phone number or email.';
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

    // Simulate clean network dispatch & local storage persistence
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedData({ ...formData });

      // Save to localStorage so responses can be reviewed
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

      // Trigger celebratory confetti if attending
      if (formData.attending === 'yes') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C8B89E', '#A38F70', '#E8E2D8', '#FAF8F5'],
        });
      }

      // Open native modal dialog
      if (successDialogRef.current) {
        successDialogRef.current.showModal();
      }
    }, 700);
  };

  const closeSuccessModal = () => {
    if (successDialogRef.current) {
      successDialogRef.current.close();
    }
    // Reset form after closing
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
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF8F5]">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
          >
            Kindly Respond
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
          >
            RSVP Attendance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs sm:text-sm text-[#6B635B] mt-3 font-light"
          >
            Please let us know if you can join us by October 31, 2026.
          </motion.p>
          <div className="w-16 h-px bg-[#C8B89E] mx-auto mt-6" />
        </div>

        {/* RSVP Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E8E2D8] shadow-xl shadow-[#2D2926]/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" noValidate>
            {/* Attendance Choice Radio Cards */}
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-[#A38F70] font-medium mb-3">
                Will you be attending? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.attending === 'yes'
                      ? 'border-[#2D2926] bg-[#FAF8F5] ring-1 ring-[#2D2926]'
                      : 'border-[#E8E2D8] hover:border-[#C8B89E] bg-white'
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
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      formData.attending === 'yes'
                        ? 'border-[#2D2926] bg-[#2D2926]'
                        : 'border-[#C8B89E]'
                    }`}
                  >
                    {formData.attending === 'yes' && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="font-serif text-base text-[#2D2926] font-medium block">
                      Joyfully Accept
                    </span>
                    <span className="text-xs text-[#6B635B]">I will celebrate with you</span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.attending === 'no'
                      ? 'border-[#2D2926] bg-[#FAF8F5] ring-1 ring-[#2D2926]'
                      : 'border-[#E8E2D8] hover:border-[#C8B89E] bg-white'
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
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      formData.attending === 'no'
                        ? 'border-[#2D2926] bg-[#2D2926]'
                        : 'border-[#C8B89E]'
                    }`}
                  >
                    {formData.attending === 'no' && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <span className="font-serif text-base text-[#2D2926] font-medium block">
                      Regretfully Decline
                    </span>
                    <span className="text-xs text-[#6B635B]">Celebrating from afar</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs uppercase tracking-[0.15em] text-[#A38F70] font-medium mb-2"
              >
                Full Name (ชื่อ-นามสกุล) *
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g., Katherine Reynolds"
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-[#FAF8F5] border text-sm text-[#2D2926] placeholder:text-[#A38F70]/60 focus:outline-none focus:ring-2 focus:ring-[#C8B89E] transition-all ${
                    errors.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-[#E8E2D8]'
                  }`}
                />
                <User className="w-4 h-4 text-[#A38F70] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.fullName && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Contact Phone / Email */}
            <div>
              <label
                htmlFor="contact"
                className="block text-xs uppercase tracking-[0.15em] text-[#A38F70] font-medium mb-2"
              >
                Phone Number / Email *
              </label>
              <div className="relative">
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g., +66 81 234 5678 or guest@example.com"
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-[#FAF8F5] border text-sm text-[#2D2926] placeholder:text-[#A38F70]/60 focus:outline-none focus:ring-2 focus:ring-[#C8B89E] transition-all ${
                    errors.contact ? 'border-red-400 ring-1 ring-red-400' : 'border-[#E8E2D8]'
                  }`}
                />
                <Phone className="w-4 h-4 text-[#A38F70] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.contact && (
                <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.contact}</span>
                </p>
              )}
            </div>

            {/* Conditional fields if Attending */}
            {formData.attending === 'yes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Guest Count */}
                <div>
                  <label
                    htmlFor="guestCount"
                    className="block text-xs uppercase tracking-[0.15em] text-[#A38F70] font-medium mb-2"
                  >
                    Number of Guests (รวมผู้ติดตาม)
                  </label>
                  <div className="relative">
                    <select
                      id="guestCount"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-11 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#C8B89E] transition-all"
                    >
                      <option value="1">1 Person (Just me)</option>
                      <option value="2">2 Persons (+1 Guest)</option>
                      <option value="3">3 Persons</option>
                      <option value="4">4 Persons (Family)</option>
                    </select>
                    <Users className="w-4 h-4 text-[#A38F70] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <label
                    htmlFor="dietary"
                    className="block text-xs uppercase tracking-[0.15em] text-[#A38F70] font-medium mb-2"
                  >
                    Dietary Requirements (แพ้อาหาร)
                  </label>
                  <input
                    id="dietary"
                    name="dietary"
                    type="text"
                    value={formData.dietary}
                    onChange={handleChange}
                    placeholder="e.g., Vegetarian, Halal, Seafood allergy"
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#2D2926] placeholder:text-[#A38F70]/60 focus:outline-none focus:ring-2 focus:ring-[#C8B89E] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Wishes for the Couple */}
            <div>
              <label
                htmlFor="wishes"
                className="block text-xs uppercase tracking-[0.15em] text-[#A38F70] font-medium mb-2"
              >
                Wishes &amp; Congratulations (คำอวยพร)
              </label>
              <div className="relative">
                <textarea
                  id="wishes"
                  name="wishes"
                  rows="3"
                  value={formData.wishes}
                  onChange={handleChange}
                  placeholder="Share a sweet memory, favorite advice, or blessing for the couple..."
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-sm text-[#2D2926] placeholder:text-[#A38F70]/60 focus:outline-none focus:ring-2 focus:ring-[#C8B89E] transition-all resize-none"
                />
                <MessageSquare className="w-4 h-4 text-[#A38F70] absolute left-4 top-4" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#2D2926] text-white font-sans text-xs sm:text-sm uppercase tracking-[0.2em] font-medium hover:bg-[#A38F70] transition-colors duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending RSVP...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#C8B89E]" />
                    <span>Confirm My RSVP</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Modal using Native <dialog> per Modern Web Guidance */}
      <dialog
        ref={successDialogRef}
        aria-labelledby="rsvp-success-title"
        closedby="any"
        onClick={handleDialogBackdropClick}
        className="fixed inset-0 m-auto max-w-lg w-[90vw] bg-transparent p-0 rounded-3xl border-0 outline-none backdrop:bg-black/60 backdrop:backdrop-blur-md"
      >
        {submittedData && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-2xl text-center relative"
          >
            <button
              type="button"
              onClick={closeSuccessModal}
              aria-label="Close confirmation card"
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center text-[#2D2926] hover:bg-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#F4EFEB] border border-[#C8B89E]/40 flex items-center justify-center mx-auto mb-5 text-[#2D2926]">
              <Heart className="w-8 h-8 text-[#C8B89E] fill-current animate-pulse" />
            </div>

            <h3 id="rsvp-success-title" className="font-serif text-3xl text-[#2D2926] font-normal mb-2">
              Thank You, {submittedData.fullName}!
            </h3>

            <p className="font-serif italic text-base text-[#A38F70] mb-4">
              {submittedData.attending === 'yes'
                ? 'We cannot wait to celebrate our magical day with you!'
                : 'Thank you for your warm thoughts from afar. You will be missed!'}
            </p>

            <div className="bg-[#FAF8F5] rounded-2xl p-4 text-xs text-[#6B635B] space-y-1.5 mb-6 text-left border border-[#E8E2D8]/60">
              <p>
                <strong>Status:</strong>{' '}
                {submittedData.attending === 'yes' ? 'Attending with Joy' : 'Regretfully Declined'}
              </p>
              {submittedData.attending === 'yes' && (
                <p>
                  <strong>Guest Count:</strong> {submittedData.guestCount}
                </p>
              )}
              {submittedData.dietary && (
                <p>
                  <strong>Dietary Note:</strong> {submittedData.dietary}
                </p>
              )}
              {submittedData.wishes && (
                <p className="italic pt-1 border-t border-[#E8E2D8]">
                  &ldquo;{submittedData.wishes}&rdquo;
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={closeSuccessModal}
              className="w-full py-3 rounded-full bg-[#2D2926] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#A38F70] transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
