import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ChevronDown, Copy, Check, CreditCard, QrCode } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import PromptPayCard from './PromptPayCard';

export default function GiftRegistry() {
  const { bankAccounts } = weddingData;
  const [isOpen, setIsOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' or 'qr'

  const copyAccountNumber = (accNumber, index) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <section id="registry" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F7F4EF]/50">
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
            With Our Gratitude
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
          >
            Gift Registry &amp; Blessings
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
          />
        </div>

        {/* Introduction note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E2D8] shadow-xl shadow-[#2D2926]/5 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#C8B89E]/40 flex items-center justify-center mx-auto mb-4 text-[#C8B89E]">
            <Gift className="w-5 h-5" />
          </div>

          <h3 className="font-serif text-2xl text-[#2D2926] mb-3">Your Presence Is Our Present</h3>
          <p className="text-sm text-[#6B635B] font-light leading-relaxed max-w-xl mx-auto mb-8">
            The greatest gift you can give us is your warm presence and blessing as we celebrate our marriage.
            Should you wish to honor us with a monetary gift towards our honeymoon and future home, bank transfer details and PromptPay QR codes are provided below.
          </p>

          {/* Collapsible Accordion Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#C8B89E] hover:bg-white text-xs sm:text-sm font-sans tracking-wider uppercase text-[#2D2926] transition-all shadow-xs cursor-pointer group"
          >
            <CreditCard className="w-4 h-4 text-[#C8B89E]" />
            <span>{isOpen ? 'Hide Gift Details' : 'View Bank Transfer & PromptPay QR'}</span>
            <ChevronDown
              className={`w-4 h-4 text-[#A38F70] transition-transform duration-300 ${
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
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                {/* Switch between Bank Accounts & PromptPay QR */}
                <div className="flex justify-center mt-8 mb-6">
                  <div className="inline-flex p-1 rounded-full bg-[#FAF8F5] border border-[#E8E2D8]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('bank')}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans tracking-wider transition-all ${
                        activeTab === 'bank'
                          ? 'bg-white text-[#2D2926] shadow-xs font-medium border border-[#E8E2D8]'
                          : 'text-[#6B635B] hover:text-[#2D2926]'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Bank Accounts</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('qr')}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans tracking-wider transition-all ${
                        activeTab === 'qr'
                          ? 'bg-white text-[#2D2926] shadow-xs font-medium border border-[#E8E2D8]'
                          : 'text-[#6B635B] hover:text-[#2D2926]'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>PromptPay QR</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'bank' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                    {bankAccounts.map((acc, index) => (
                      <div
                        key={index}
                        className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E2D8] flex flex-col justify-between relative group hover:border-[#C8B89E] transition-colors"
                      >
                        {/* Bank Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-serif text-lg text-[#2D2926] font-medium">
                              {acc.bank}
                            </p>
                            <p className="text-xs text-[#A38F70]">{acc.bankThai}</p>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E8E2D8]">
                            <CreditCard className="w-4 h-4 text-[#A38F70]" />
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="space-y-1 mb-6">
                          <span className="text-[10px] uppercase tracking-wider text-[#A38F70] font-medium block">
                            Account Number
                          </span>
                          <div className="font-mono text-xl sm:text-2xl text-[#2D2926] font-medium tracking-wider">
                            {acc.accountNumber}
                          </div>
                          <p className="text-xs text-[#6B635B] pt-1 font-light">
                            Account Name: <strong>{acc.accountName}</strong>
                          </p>
                          <p className="text-xs text-[#6B635B] font-light">
                            PromptPay: <strong className="font-mono">{acc.promptPay}</strong>
                          </p>
                        </div>

                        {/* Copy Action Button with Toast Feedback */}
                        <button
                          type="button"
                          onClick={() => copyAccountNumber(acc.cleanNumber, index)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            copiedIndex === index
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-[#2D2926] border border-[#E8E2D8] hover:border-[#C8B89E] shadow-xs'
                          }`}
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Account Number Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#C8B89E]" />
                              <span>Copy Account Number</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
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
