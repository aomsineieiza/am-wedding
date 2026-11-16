import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ChevronDown, Copy, Check, CreditCard, Download, QrCode, X } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

export default function GiftRegistry() {
  const { lang, t } = useLanguage();
  const { bankAccounts } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const registrySheetRef = useRef(null);

  const copyAccountNumber = (accNumber, index) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch('/images/kbank-qr.jpg');
      const blob = await response.blob();
      const file = new File([blob], 'kbank-qr-kewalin.jpg', { type: 'image/jpeg' });

      // 1. Try Native Share for iOS & Android Photos Gallery
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'KBANK PromptPay QR Code - Kewalin',
            text: 'QR Code สำหรับร่วมอวยพร - Kewalin Charnchanaroj',
          });
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 2500);
          return;
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') return;
        }
      }

      // 2. Fallback to Blob URL download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'kbank-qr-kewalin.jpg';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1200);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      // 3. Fallback to direct anchor link
      const link = document.createElement('a');
      link.href = '/images/kbank-qr.jpg';
      link.download = 'kbank-qr-kewalin.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
  };

  const handleToggleRegistry = () => {
    if (window.innerWidth < 640) {
      if (registrySheetRef.current) {
        registrySheetRef.current.showModal();
      }
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSheetBackdropClick = (e) => {
    if (!registrySheetRef.current) return;
    const rect = registrySheetRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      registrySheetRef.current.close();
    }
  };

  const renderAccountsContent = () => (
    <div className="mt-4 sm:mt-6 max-w-md mx-auto text-left">
      {bankAccounts.map((acc, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between hover:border-[#C4DDFB] transition-colors shadow-xs space-y-5"
        >
          {/* Bank Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-slate-900">
                {lang === 'th' ? acc.bankThai : acc.bank}
              </p>
              <p className="text-xs text-[#0074E2] font-medium">
                {lang === 'th' ? acc.bank : acc.bankThai}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
              <CreditCard className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Thai QR Payment Card */}
          {acc.qrCodeImage && (
            <div className="flex flex-col items-center bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200 text-center">
              <div className="max-w-[240px] w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                <img
                  src={acc.qrCodeImage}
                  alt="Thai QR Payment"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-light">
                {t('registry.qrHint', 'สแกนผ่านแอปธนาคารได้ทุกธนาคาร หรือแตะค้างที่รูปเพื่อบันทึก')}
              </p>

              {/* Download / Save Image Button */}
              <button
                type="button"
                onClick={handleDownloadQr}
                className={`mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  downloadSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0074E2] text-white hover:bg-[#0060B8] shadow-xs active:scale-98'
                }`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('registry.qrSaved', 'บันทึกรูป QR Code แล้ว!')}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t('registry.saveQr', 'บันทึกรูป QR Code ลงเครื่อง')}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Account Details */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
              {t('registry.accountNumber', 'เลขที่บัญชี')}
            </span>
            <div className="text-xl text-slate-900 font-bold tracking-wider">
              {acc.accountNumber}
            </div>
            <p className="text-xs text-slate-600 pt-1 font-light">
              {t('registry.accountName', 'ชื่อบัญชี')}: <strong>{lang === 'th' ? acc.accountNameThai : acc.accountName}</strong>
            </p>
            {acc.accountNameThai && (
              <p className="text-xs text-slate-500 font-light">
                ({lang === 'th' ? acc.accountName : acc.accountNameThai})
              </p>
            )}
          </div>

          {/* Copy Account Number Button */}
          <button
            type="button"
            onClick={() => copyAccountNumber(acc.cleanNumber, index)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copiedIndex === index
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-[#0074E2] hover:text-[#0074E2]'
            }`}
          >
            {copiedIndex === index ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('registry.copiedAccount', 'คัดลอกเลขบัญชีแล้ว!')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('registry.copyAccount', 'คัดลอกเลขที่บัญชี')}</span>
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <section id="registry" className="py-10 sm:py-16 px-4 sm:px-6 bg-transparent">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FAFAFB] text-[#52525B] text-[11px] font-medium tracking-[0.28em] uppercase mb-3 border border-[#E2E5E9]"
          >
            <span>{t('registry.badge', 'ร่วมแสดงความยินดี')}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#27272A] tracking-tight"
          >
            {t('registry.title', 'ร่วมแสดงความยินดี')}
          </motion.h2>
          <p className="text-sm text-[#71717A] mt-2 font-normal">
            {t('registry.subtitle', 'การได้ร่วมฉลองกับทุกท่านคือความสุขที่มีค่าที่สุดสำหรับเรา')}
          </p>
        </div>

        {/* Note Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#FAFAFB] rounded-[32px] p-6 sm:p-10 border border-[#E2E5E9] text-center shadow-[0_20px_50px_-15px_rgba(30,41,59,0.06),inset_0_1px_0_#FFFFFF]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4FE] text-[#0074E2] flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t('registry.cardTitle', 'ขอบคุณสำหรับความปรารถนาดี')}
          </h3>
          <p className="text-sm text-slate-600 font-light leading-relaxed max-w-xl mx-auto mb-8">
            {t(
              'registry.cardDesc',
              'สำหรับท่านที่ประสงค์จะร่วมแสดงความยินดีผ่านการโอนเงิน สามารถดูรายละเอียดบัญชีธนาคารและ QR Code ด้านล่างได้เลย'
            )}
          </p>

          {/* Trigger Accordion / Bottom Sheet Button */}
          <button
            type="button"
            onClick={handleToggleRegistry}
            aria-expanded={isOpen}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-[#0074E2] hover:text-[#0074E2] text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-xs cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#0074E2]" />
            <span>
              {isOpen
                ? t('registry.hideDetails', 'ซ่อนรายละเอียด')
                : t('registry.showDetails', 'ดูเลขที่บัญชี & QR Code รับเงิน')}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Desktop Inline Accordion Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden hidden sm:block"
              >
                {renderAccountsContent()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Bottom Sheet for Bank Accounts & PromptPay */}
      <dialog
        ref={registrySheetRef}
        aria-labelledby="registry-sheet-title"
        closedby="any"
        onClick={handleSheetBackdropClick}
        className="bottom-sheet-dialog fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-full bg-transparent p-0 border-0 outline-none backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl pt-3 pb-8 px-5 border-t border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto"
        >
          {/* Bottom Sheet Pill Handle */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mb-4" />

          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-full bg-[#EBF4FE] text-[#0074E2] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 id="registry-sheet-title" className="text-base font-bold text-slate-900">
                  เลขที่บัญชี &amp; QR Code รับเงิน
                </h3>
                <p className="text-[11px] text-slate-500">ร่วมแสดงความยินดีแด่คู่บ่าวสาว</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => registrySheetRef.current?.close()}
              aria-label="Close bottom sheet"
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {renderAccountsContent()}
        </div>
      </dialog>
    </section>
  );
}
