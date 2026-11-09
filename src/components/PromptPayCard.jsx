import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck } from 'lucide-react';

export default function PromptPayCard({ bank, promptPayId, accountName, cleanNumber, accountNumber }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptPayId || cleanNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate a mock QR SVG pattern that looks like a real PromptPay QR code
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 shadow-xs flex flex-col items-center text-center">
      {/* PromptPay Top Blue Banner */}
      <div className="w-full bg-[#1A3762] text-white py-1.5 px-3 rounded-lg text-[11px] font-sans font-bold tracking-widest uppercase mb-4 flex items-center justify-center gap-1.5 shadow-xs">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00A3E0]" />
        <span>Thai QR Payment (PromptPay)</span>
      </div>

      {/* QR Code Container */}
      <div className="relative p-3 bg-white rounded-xl border border-[#E8E2D8] shadow-inner mb-3">
        <svg
          viewBox="0 0 100 100"
          className="w-32 h-32 text-[#1A3762]"
          fill="currentColor"
        >
          {/* Stylized QR Code Pattern */}
          <rect x="0" y="0" width="30" height="30" rx="3" fill="#1A3762" />
          <rect x="5" y="5" width="20" height="20" rx="2" fill="#FFFFFF" />
          <rect x="10" y="10" width="10" height="10" rx="1" fill="#1A3762" />

          <rect x="70" y="0" width="30" height="30" rx="3" fill="#1A3762" />
          <rect x="75" y="5" width="20" height="20" rx="2" fill="#FFFFFF" />
          <rect x="80" y="10" width="10" height="10" rx="1" fill="#1A3762" />

          <rect x="0" y="70" width="30" height="30" rx="3" fill="#1A3762" />
          <rect x="5" y="75" width="20" height="20" rx="2" fill="#FFFFFF" />
          <rect x="10" y="80" width="10" height="10" rx="1" fill="#1A3762" />

          {/* Random decorative QR data blocks */}
          <rect x="36" y="6" width="6" height="6" />
          <rect x="46" y="12" width="8" height="6" />
          <rect x="58" y="6" width="6" height="6" />
          <rect x="36" y="24" width="8" height="6" />
          <rect x="48" y="24" width="6" height="6" />

          <rect x="6" y="36" width="6" height="8" />
          <rect x="16" y="48" width="8" height="6" />
          <rect x="24" y="36" width="6" height="6" />
          <rect x="6" y="56" width="8" height="6" />

          <rect x="72" y="36" width="6" height="6" />
          <rect x="84" y="44" width="8" height="6" />
          <rect x="72" y="56" width="6" height="8" />

          {/* Center decorative ring monogram emblem */}
          <rect x="38" y="38" width="24" height="24" rx="4" fill="#FFFFFF" />
          <rect x="40" y="40" width="20" height="20" rx="3" fill="#FAF8F5" stroke="#C8B89E" strokeWidth="1.5" />
          <text x="50" y="54" fontSize="10" textAnchor="middle" fill="#2D2926" fontFamily="serif" fontWeight="bold">
            A&amp;M
          </text>

          <rect x="36" y="68" width="6" height="6" />
          <rect x="46" y="76" width="6" height="6" />
          <rect x="58" y="84" width="6" height="6" />
          <rect x="72" y="72" width="6" height="6" />
          <rect x="84" y="80" width="8" height="6" />
        </svg>
      </div>

      <div className="space-y-0.5 text-xs text-[#2D2926]">
        <p className="font-serif font-medium text-sm">{accountName}</p>
        <p className="font-mono text-[#A38F70]">PromptPay: {promptPayId}</p>
        <p className="text-[11px] text-[#6B635B]">{bank}: {accountNumber}</p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] hover:border-[#C8B89E] text-xs font-sans text-[#2D2926] transition-colors shadow-xs"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied Number</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[#C8B89E]" />
            <span>Copy PromptPay</span>
          </>
        )}
      </button>
    </div>
  );
}

