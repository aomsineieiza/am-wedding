import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ChevronDown, Copy, Check, CreditCard, QrCode } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import PromptPayCard from './PromptPayCard';

export default function GiftRegistry() {
  const { bankAccounts } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('bank');

  const copyAccountNumber = (accNumber, index) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <section id="registry" className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
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
            <Gift className="w-3.5 h-3.5" />
            <span>GIFT REGISTRY &amp; BLESSINGS</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight"
          >
            ของขวัญและบัญชีแสดงความยินดี
          </motion.h2>
          <p className="text-sm text-slate-500 mt-2 font-normal">
            การได้พบและร่วมฉลองกับทุกท่านคือของขวัญที่มีค่าที่สุดสำหรับเรา
          </p>
        </div>

        {/* Note Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-slate-50/70 rounded-3xl p-6 sm:p-10 border border-slate-200 text-center shadow-xl shadow-slate-900/5"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4FE] text-[#0074E2] flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Your Presence Is Our Present</h3>
          <p className="text-sm text-slate-600 font-light leading-relaxed max-w-xl mx-auto mb-8">
            การมาร่วมแสดงความยินดีของทุกท่านคือเกียรติและความสุขอันสูงสุด หากท่านมีความประสงค์จะร่วมอวยพรเป็นของขวัญเริ่มต้นครอบครัวใหม่ สามารถดูรายละเอียดบัญชีและ PromptPay QR ได้ด้านล่างนี้ค่ะ
          </p>

          {/* Trigger Accordion Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 hover:border-[#0074E2] hover:text-[#0074E2] text-xs sm:text-sm font-semibold text-slate-800 transition-all shadow-xs cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#0074E2]" />
            <span>{isOpen ? 'ซ่อนรายละเอียดบัญชี' : 'ดูรายละเอียดเลขที่บัญชี & PromptPay'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Accordion Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* Switch between Bank Accounts & PromptPay QR */}
                <div className="flex justify-center mt-8 mb-6">
                  <div className="inline-flex p-1 rounded-full bg-white border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('bank')}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'bank'
                          ? 'bg-[#0074E2] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>โอนผ่านธนาคาร</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('qr')}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === 'qr'
                          ? 'bg-[#0074E2] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>PromptPay QR</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'bank' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {bankAccounts.map((acc, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-[#C4DDFB] transition-colors shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-base font-bold text-slate-900">
                              {acc.bank}
                            </p>
                            <p className="text-xs text-[#0074E2] font-medium">{acc.bankThai}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
                            <CreditCard className="w-4 h-4 text-slate-500" />
                          </div>
                        </div>

                        <div className="space-y-1 mb-6">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                            เลขที่บัญชี
                          </span>
                          <div className="text-xl text-slate-900 font-bold tracking-wider">
                            {acc.accountNumber}
                          </div>
                          <p className="text-xs text-slate-600 pt-1 font-light">
                            ชื่อบัญชี: <strong>{acc.accountName}</strong>
                          </p>
                          <p className="text-xs text-slate-600 font-light">
                            พร้อมเพย์: <strong className="text-[#0074E2]">{acc.promptPay}</strong>
                          </p>
                        </div>

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
                              <span>คัดลอกเลขบัญชีแล้ว!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>คัดลอกเลขที่บัญชี</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    {bankAccounts.map((acc, index) => (
                      <PromptPayCard
                        key={index}
                        bank={acc.bank}
                        accountName={acc.accountName}
                        accountNumber={acc.accountNumber}
                        cleanNumber={acc.cleanNumber}
                        promptPayId={acc.promptPay}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
