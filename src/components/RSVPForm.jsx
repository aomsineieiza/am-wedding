import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartHandshake, Send, CheckCircle2, User, Phone, Users, MessageSquare, AlertCircle, X, Sparkles, ChevronDown, Download, Check, Printer, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toBlob as htmlToBlob } from 'html-to-image';
import { weddingData } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';
import { playPrinterSoundEffect } from '../utils/printerSound';

const getGuestOptions = (lang = 'th') => [
  { value: 1, label: lang === 'th' ? '1 ท่าน' : '1 Guest', desc: lang === 'th' ? 'เฉพาะตัวฉัน' : 'Myself only', badge: '1' },
  { value: 2, label: lang === 'th' ? '2 ท่าน' : '2 Guests', desc: lang === 'th' ? '+ ผู้ติดตาม 1 ท่าน' : '+ 1 Guest', badge: '2' },
  { value: 3, label: lang === 'th' ? '3 ท่าน' : '3 Guests', desc: lang === 'th' ? '+ ผู้ติดตาม 2 ท่าน' : '+ 2 Guests', badge: '3' },
  { value: 4, label: lang === 'th' ? '4 ท่าน' : '4 Guests', desc: lang === 'th' ? '+ ผู้ติดตาม 3 ท่าน' : '+ 3 Guests', badge: '4' },
  { value: 'custom', label: lang === 'th' ? 'มากกว่า 4 ท่าน' : 'More than 4', desc: lang === 'th' ? 'กรุณาระบุจำนวน' : 'Please specify', badge: '5+' },
];

export default function RSVPForm() {
  const { lang, t } = useLanguage();
  const { couple, venue } = weddingData;
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
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);
  const [isDownloadingTicket, setIsDownloadingTicket] = useState(false);
  const [isTicketDownloaded, setIsTicketDownloaded] = useState(false);
  const [iosTicketPreview, setIosTicketPreview] = useState(null);
  const [showIosSaveModal, setShowIosSaveModal] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const ticketCardRef = useRef(null);

  const handleSaveTicketBlob = async (blob) => {
    if (!blob) {
      setIsDownloadingTicket(false);
      return;
    }

    const rawName = (submittedData?.fullName || 'guest').trim().replace(/\s+/g, '_');
    const fileName = `wedding-ticket-${rawName}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // 1. Desktop Browser: Save image file immediately to Downloads without opening share sheets
    if (!isMobile) {
      try {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1200);

        setIsTicketDownloaded(true);
        setTimeout(() => setIsTicketDownloaded(false), 3000);
      } catch (err) {
        console.error('Desktop download error:', err);
      } finally {
        setIsDownloadingTicket(false);
      }
      return;
    }

    // 2. Mobile Browser: Native Web Share API (Directly saves to Photos / Camera Roll)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Aomsin & Mild Wedding Tour Ticket',
          text: 'บัตรเข้างานแต่งงาน Aomsin & Mild Wedding Tour',
        });
        setIsTicketDownloaded(true);
        setTimeout(() => setIsTicketDownloaded(false), 3000);
        setIsDownloadingTicket(false);
        return;
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') {
          setIsDownloadingTicket(false);
          return;
        }
        console.warn('Native share error, falling back:', shareErr);
      }
    }

    const blobUrl = URL.createObjectURL(blob);

    // 3. iOS Fallback for HTTP local testing or In-App Browsers (LINE / FB)
    if (isIOS) {
      setIosTicketPreview(blobUrl);
      setShowIosSaveModal(true);
      setIsTicketDownloaded(true);
      setTimeout(() => setIsTicketDownloaded(false), 3000);
      setIsDownloadingTicket(false);
      return;
    }

    // 4. Standard Blob URL Download
    try {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1200);

      setIsTicketDownloaded(true);
      setTimeout(() => setIsTicketDownloaded(false), 3000);
    } finally {
      setIsDownloadingTicket(false);
    }
  };

  const render4KCanvasFallback = (onComplete) => {
    try {
      const canvas = document.createElement('canvas');
      const baseW = 640;
      const baseH = submittedData.wishes ? 1040 : 960;
      const scale = 2160 / baseW; // 3.375x scale = 2160px width (4K UHD)
      canvas.width = 2160;
      canvas.height = Math.round(baseH * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(scale, scale);

      const renderCanvas = (coupleImg = null) => {
        // 1. Paper Background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, baseW, baseH);

        // 2. Outer Card Border with rounded corners
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(14, 14, baseW - 28, baseH - 28, 18);
        } else {
          ctx.rect(14, 14, baseW - 28, baseH - 28);
        }
        ctx.stroke();

        // 3. Top Dotted Line with Airplane Emblem
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(48, 54);
        ctx.lineTo(baseW / 2 - 28, 54);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(baseW / 2 + 28, 54);
        ctx.lineTo(baseW - 48, 54);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center Airplane Circle
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(baseW / 2, 54, 17, 0, Math.PI * 2);
        ctx.fill();

        // Vector SVG Airplane Icon matching web card
        ctx.save();
        ctx.translate(baseW / 2 - 10, 54 - 10);
        ctx.scale(0.83, 0.83);
        const planeSvg = new Path2D(
          'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'
        );
        ctx.fillStyle = '#FFFFFF';
        ctx.fill(planeSvg);
        ctx.restore();

        // Subtitle: BOARDING PASS
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('B O A R D I N G   P A S S', baseW / 2, 94);

        // 4. Washi Tape Title: AM2027 WEDDING rotated -2.2deg
        ctx.save();
        ctx.translate(baseW / 2, 154);
        ctx.rotate((-2.2 * Math.PI) / 180);

        // Tape 1: AM2027
        const tape1Path = new Path2D(
          'M 5,2 Q 15,0 30,1 L 135,0 Q 150,1 155,3 L 153,10 L 157,18 L 154,27 L 156,34 Q 140,35 120,34 L 25,36 Q 10,35 4,33 L 7,24 L 3,16 L 6,8 Z'
        );
        ctx.save();
        ctx.translate(-130, -32);
        ctx.scale(1.62, 1.4);
        ctx.fillStyle = 'rgba(160, 192, 214, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        ctx.fill(tape1Path);
        ctx.restore();

        ctx.fillStyle = '#0F172A';
        ctx.font = '900 46px Impact, "Arial Narrow Bold", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AM2027', 0, -8);

        // Tape 2: WEDDING
        const tape2Path = new Path2D(
          'M 4,2 Q 18,1 35,2 L 130,1 Q 148,2 156,4 L 154,10 L 157,18 L 153,25 L 155,31 Q 138,32 115,31 L 20,33 Q 8,32 4,30 L 6,22 L 3,13 L 5,6 Z'
        );
        ctx.save();
        ctx.translate(-128, 16);
        ctx.scale(1.6, 1.25);
        ctx.fillStyle = 'rgba(160, 192, 214, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        ctx.fill(tape2Path);
        ctx.restore();

        ctx.fillStyle = '#0F172A';
        ctx.font = '900 34px Impact, "Arial Narrow Bold", sans-serif';
        ctx.fillText('WEDDING', 0, 36);

        ctx.restore();

        // Blue Subtitle
        ctx.fillStyle = '#0074E2';
        ctx.font = '900 15px "Google Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LE PASIRI • NONTHABURI', baseW / 2, 242);

        // 5. 3D Cartoon Couple Image
        let currentY = 264;
        if (coupleImg && coupleImg.complete && coupleImg.naturalWidth > 0) {
          const imgSize = 310;
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.20)';
          ctx.shadowBlur = 16;
          ctx.shadowOffsetY = 8;
          ctx.drawImage(coupleImg, (baseW - imgSize) / 2, currentY, imgSize, imgSize);
          ctx.restore();
          currentY += imgSize + 16;
        } else {
          currentY += 50;
        }

        // 6. Grid Table
        const tableX = 48;
        const tableW = baseW - 96;
        const colMid = tableX + tableW / 2;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        // Top table border
        ctx.beginPath();
        ctx.moveTo(tableX, currentY);
        ctx.lineTo(tableX + tableW, currentY);
        ctx.stroke();

        // Row 1: VENUE & DATE
        const row1H = 64;
        ctx.beginPath();
        ctx.moveTo(tableX, currentY + row1H);
        ctx.lineTo(tableX + tableW, currentY + row1H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(colMid, currentY);
        ctx.lineTo(colMid, currentY + row1H);
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('VENUE:', tableX + 14, currentY + 20);
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 16px "Google Sans", sans-serif';
        ctx.fillText(`${(venue.name || 'LE PASIRI').toUpperCase()}`, tableX + 14, currentY + 41);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('NONTHABURI', tableX + 14, currentY + 55);

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('DATE:', colMid + 14, currentY + 20);
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 16px "Google Sans", sans-serif';
        ctx.fillText('23 JAN 2027', colMid + 14, currentY + 41);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('SATURDAY', colMid + 14, currentY + 55);

        currentY += row1H;

        // Row 2: CEREMONY TIME & RECEPTION TIME
        const row2H = 60;
        ctx.beginPath();
        ctx.moveTo(tableX, currentY + row2H);
        ctx.lineTo(tableX + tableW, currentY + row2H);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(colMid, currentY);
        ctx.lineTo(colMid, currentY + row2H);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('CEREMONY TIME:', tableX + 14, currentY + 20);
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 16px "Google Sans", sans-serif';
        ctx.fillText('15:30', tableX + 14, currentY + 40);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('03:30 PM', tableX + 14, currentY + 54);

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('RECEPTION TIME:', colMid + 14, currentY + 20);
        ctx.fillStyle = '#0F172A';
        ctx.font = '900 16px "Google Sans", sans-serif';
        ctx.fillText('18:30', colMid + 14, currentY + 40);
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('06:30 PM', colMid + 14, currentY + 54);

        currentY += row2H;

        // Row 3: PASSENGER & Status Pill Badge
        const row3H = 96;
        ctx.beginPath();
        ctx.moveTo(tableX, currentY + row3H);
        ctx.lineTo(tableX + tableW, currentY + row3H);
        ctx.stroke();

        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('PASSENGER:', tableX + 14, currentY + 22);

        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 20px "Google Sans", sans-serif';
        const guestName = `คุณ ${submittedData.fullName}${submittedData.nickname ? ` (${submittedData.nickname})` : ''}`;
        ctx.fillText(guestName, tableX + 14, currentY + 50);

        ctx.fillStyle = '#0074E2';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`ADMIT: ${submittedData.guestCount} TICKET(S)`, tableX + 14, currentY + 76);

        // Status Pill Badge
        const isAttending = submittedData.attending === 'yes';
        const statusText = isAttending ? 'CONFIRMED' : 'DECLINED';
        const badgeX = tableX + 190;
        const badgeY = currentY + 63;
        ctx.fillStyle = isAttending ? '#ECFDF5' : '#FEF2F2';
        ctx.strokeStyle = isAttending ? '#A7F3D0' : '#FECACA';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(badgeX, badgeY, 95, 18, 9);
        } else {
          ctx.rect(badgeX, badgeY, 95, 18);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isAttending ? '#047857' : '#B91C1C';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(statusText, badgeX + 47.5, badgeY + 13);

        currentY += row3H + 18;

        // Wishes Section
        if (submittedData.wishes) {
          const maxTextW = tableW - 40;
          ctx.font = 'italic 12px "Google Sans", sans-serif';
          const fullWish = submittedData.wishes.trim();

          let lines = [];
          let remaining = fullWish;

          let l1 = '';
          let i = 0;
          while (i < remaining.length && ctx.measureText(l1 + remaining[i]).width <= maxTextW) {
            l1 += remaining[i];
            i++;
          }
          lines.push(l1);
          remaining = remaining.slice(i).trim();

          if (remaining.length > 0) {
            let l2 = '';
            let j = 0;
            while (j < remaining.length && ctx.measureText(l2 + remaining[j] + '...').width <= maxTextW) {
              l2 += remaining[j];
              j++;
            }
            if (j < remaining.length) {
              l2 += '...';
            }
            lines.push(l2);
          }

          const wishBoxH = lines.length > 1 ? 62 : 48;
          ctx.fillStyle = '#F8FAFC';
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(tableX, currentY, tableW, wishBoxH, 8);
          } else {
            ctx.rect(tableX, currentY, tableW, wishBoxH);
          }
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('GUEST WISH • คำอวยพร', baseW / 2, currentY + 16);

          ctx.fillStyle = '#0F172A';
          ctx.font = 'italic 12px "Google Sans", sans-serif';
          if (lines.length === 1) {
            ctx.fillText(`“${lines[0]}”`, baseW / 2, currentY + 34);
          } else if (lines.length >= 2) {
            ctx.fillText(`“${lines[0]}`, baseW / 2, currentY + 33);
            ctx.fillText(`${lines[1]}”`, baseW / 2, currentY + 49);
          }
          currentY += wishBoxH + 18;
        }

        // Footer Copyright
        const footerY = baseH - 28;
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('© AOMSIN & MILD WEDDING. ALL RIGHTS RESERVED.', baseW / 2, footerY);

        canvas.toBlob((blob) => {
          onComplete(blob);
        }, 'image/png', 1.0);
      };

      const coupleImg = new Image();
      coupleImg.crossOrigin = 'anonymous';
      coupleImg.src = '/images/cartoon-couple.png';

      let isRendered = false;
      const doRender = () => {
        if (!isRendered) {
          isRendered = true;
          renderCanvas(coupleImg);
        }
      };

      coupleImg.onload = doRender;
      coupleImg.onerror = doRender;
      setTimeout(doRender, 1000);
    } catch (err) {
      console.error('Canvas render error:', err);
      setIsDownloadingTicket(false);
    }
  };

  const downloadTicketImage = async () => {
    if (!submittedData) return;
    setIsDownloadingTicket(true);

    try {
      // 1. Primary Strategy: Capture the exact DOM card element at 4K UHD (2160px width)
      if (ticketCardRef.current) {
        try {
          const el = ticketCardRef.current;
          const targetWidth = 2160;
          const pixelRatio = targetWidth / Math.max(el.offsetWidth, 300);

          const blob = await htmlToBlob(el, {
            pixelRatio,
            quality: 1.0,
            backgroundColor: '#FFFFFF',
            cacheBust: true,
          });

          if (blob && blob.size > 2000) {
            await handleSaveTicketBlob(blob);
            return;
          }
        } catch (captureErr) {
          console.warn('DOM 4K capture fallback to canvas:', captureErr);
        }
      }

      // 2. High-Precision 4K Canvas Fallback (2160px width)
      render4KCanvasFallback(handleSaveTicketBlob);
    } catch (err) {
      console.error('Download ticket error:', err);
      setIsDownloadingTicket(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsGuestDropdownOpen(false);
      }
    };
    if (isGuestDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isGuestDropdownOpen]);

  // Lock body & background scroll when loading overlay is active
  useEffect(() => {
    if (!isSubmitting) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('wheel', preventScroll);
    };
  }, [isSubmitting]);

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

    // If guest selects "ไม่สะดวกเข้าร่วม" (attending === 'no'): Show modal immediately without loading
    if (formData.attending === 'no') {
      setIsSubmitting(false);
      setSubmittedData({
        ...formData,
        guestCount: 0,
      });

      try {
        const stored = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        stored.push({
          ...formData,
          guestCount: 0,
          submittedAt,
        });
        localStorage.setItem('wedding_rsvps', JSON.stringify(stored));
        window.dispatchEvent(new Event('rsvp_updated'));
      } catch (err) {
        console.error('Storage error:', err);
      }

      if (successDialogRef.current) {
        successDialogRef.current.showModal();
      }
      return;
    }

    setSubmitProgress(0);

    const startTime = performance.now();
    const duration = 2300; // 2.3 seconds of smooth progress assembly

    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setSubmitProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
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
            playPrinterSoundEffect();
          }
        }, 280);
      }
    };

    requestAnimationFrame(updateProgress);
  };

  const closeSuccessModal = () => {
    if (successDialogRef.current) {
      try {
        successDialogRef.current.close();
      } catch (err) {
        // ignore
      }
    }
    setSubmittedData(null);
    setIsTicketDownloaded(false);
    if (iosTicketPreview && iosTicketPreview.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(iosTicketPreview);
      } catch {
        // ignore
      }
    }
    setIosTicketPreview(null);
    setShowIosSaveModal(false);
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
    // Disabled: modal must only be closed via the close button (X) or "เสร็จสิ้น"
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
    <section id="rsvp" className="scroll-mt-20 sm:scroll-mt-24 py-10 sm:py-16 px-4 sm:px-6 bg-transparent">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
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
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.attending === 'yes'
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
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.attending === 'yes'
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
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${formData.attending === 'no'
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
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.attending === 'no'
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
                      {t('rsvp.decline', 'ไม่สะดวกเข้าร่วม (Decline)')}
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
                    className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] focus:border-transparent transition-all ${errors.fullName ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'
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
                  className={`w-full px-4 py-3 pl-11 rounded-xl bg-white border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0074E2] focus:border-transparent transition-all tracking-wider ${errors.contact ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'
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

                {/* Custom Guest Dropdown Menu (Unified for Mobile & Desktop) */}
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsGuestDropdownOpen((prev) => !prev)}
                    aria-expanded={isGuestDropdownOpen}
                    className="w-full px-4 py-3 pl-11 pr-4 rounded-xl bg-white dark:bg-[#1E2228] border border-slate-200 dark:border-[#323842] text-sm text-slate-900 dark:text-zinc-100 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-[#0074E2] transition-all shadow-2xs hover:border-slate-300 dark:hover:border-[#424A56] cursor-pointer active:scale-[0.99]"
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
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isGuestDropdownOpen ? 'rotate-180 text-[#0074E2]' : ''
                        }`}
                    />
                  </button>
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

                  {/* Dropdown Popover */}
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
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                                ? 'border-[#0074E2] dark:border-[#38BDF8] bg-[#F0F7FF] dark:bg-[#0074E2]/15 ring-1 ring-[#0074E2]/25'
                                : 'border-transparent hover:border-slate-200 dark:hover:border-[#323842] hover:bg-slate-50 dark:hover:bg-[#252A32]'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-sm transition-colors shrink-0 ${isSelected
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
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mr-1 ${isSelected
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
                className="w-full py-4 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-85 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2 font-mono">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{submitProgress}%</span>
                  </div>
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

      {/* Loading Overlay: Minimalist White Wedding Rings Animation on Blur Overlay */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[9999] w-screen h-[100dvh] min-h-[100dvh] flex flex-col items-center justify-center p-4 bg-slate-950/75 backdrop-blur-2xl select-none touch-none overscroll-none overflow-hidden"
                onTouchMove={(e) => e.preventDefault()}
                onWheel={(e) => e.preventDefault()}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="m-auto flex flex-col items-center justify-center text-center pointer-events-none"
                >
                  {/* Minimalist White Animated Wedding Rings (Thinner & Delicate) */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                    <picture>
                      <source srcSet="/images/wedding-rings-white.webp" type="image/webp" />
                      <img
                        src="/images/wedding-rings-white.gif"
                        alt="Wedding Rings"
                        className="w-full h-full object-contain filter drop-shadow-[0_2px_16px_rgba(255,255,255,0.35)]"
                        loading="eager"
                        decoding="async"
                      />
                    </picture>
                  </div>

                  {/* Minimalist Loading Text & Status */}
                  <div className="mt-2 flex flex-col items-center space-y-1">
                    <span className="text-white font-mono font-bold tracking-widest text-base sm:text-lg">
                      {submitProgress < 100 ? `${submitProgress}%` : 'READY'}
                    </span>
                    <span className="text-white/80 text-xs sm:text-sm font-sans tracking-wide">
                      {lang === 'th' ? 'กำลังเตรียมพิมพ์บัตรเชิญ...' : 'Preparing invitation...'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Confirmation Modal: Realistic Printing Card / Wedding Ticket Overlay */}
      <dialog
        ref={successDialogRef}
        aria-labelledby="rsvp-success-title"
        onCancel={(e) => e.preventDefault()}
        onClose={() => setSubmittedData(null)}
        className="fixed inset-0 m-auto max-w-md w-[94vw] max-h-[100dvh] bg-transparent p-0 border-0 outline-none backdrop:bg-slate-950/85 backdrop:backdrop-blur-md overflow-y-auto overscroll-contain z-50 [&:not([open])]:hidden [&[open]]:flex flex-col items-center justify-start sm:justify-center py-2 sm:py-4 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {submittedData && (
          submittedData.attending === 'no' ? (
            /* =========================================================
               DECLINE GRATITUDE MODAL (Redesigned to Match Fastwork Theme)
               ========================================================= */
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[380px] sm:max-w-[410px] bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-7 text-center border border-slate-200/90 dark:border-slate-800 shadow-[0_24px_50px_-12px_rgba(0,116,226,0.18),0_12px_24px_-6px_rgba(15,23,42,0.12)] overflow-hidden my-auto select-none"
            >
              {/* Top Gradient Ribbon Accent matching Fastwork Blue & Wedding Elegance */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0074E2] via-[#38BDF8] to-[#C8B89E]" />

              {/* Ambient Soft Glow Effect */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-[#EBF4FE] via-sky-50/40 to-transparent dark:from-sky-950/30 dark:via-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Top Close Button */}
              <button
                type="button"
                onClick={closeSuccessModal}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Multilayered Icon Badge with Gentle Halo */}
              <div className="relative mx-auto mb-4 w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#EBF4FE] via-sky-50 to-[#FDF2F4] dark:from-blue-950/60 dark:to-slate-800 ring-6 ring-[#EBF4FE]/60 dark:ring-blue-900/30" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-slate-800 border border-[#C4DDFB]/80 dark:border-blue-700/40 shadow-xs flex items-center justify-center text-[#0074E2] dark:text-[#38BDF8]">
                  <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-0.5 animate-pulse" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 id="rsvp-success-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {lang === 'th' ? 'ขอบคุณที่แจ้งให้เราทราบ' : 'Thank You for Letting Us Know'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase mt-1">
                {lang === 'th' ? 'Thank you for letting us know!' : 'Aomsin & Mild Wedding'}
              </p>

              {/* Status Pill Badge: Fastwork Signature Style */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EBF4FE] dark:bg-blue-950/60 text-[#0074E2] dark:text-[#38BDF8] text-[11px] sm:text-xs font-bold border border-[#C4DDFB] dark:border-blue-800/60 mt-3 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0074E2] dark:bg-[#38BDF8]" />
                </span>
                <span>{lang === 'th' ? 'บันทึกคำตอบเรียบร้อยแล้ว' : 'Response Recorded'}</span>
              </div>

              {/* Elegant Micro-Divider */}
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mx-auto my-4" />

              {/* Warm Message Card */}
              <div className="bg-slate-50/90 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2.5">
                {submittedData.fullName && (
                  <p className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {lang === 'th'
                      ? `เรียน คุณ${submittedData.fullName}${submittedData.nickname ? ` (${submittedData.nickname})` : ''}`
                      : `Dear ${submittedData.fullName}${submittedData.nickname ? ` (${submittedData.nickname})` : ''}`}
                  </p>
                )}

                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'th'
                    ? 'แม้ไม่ได้พบกันในวันพิเศษนี้ แต่เราขอขอบคุณจากใจสำหรับความยินดีและความปรารถนาดีที่ส่งมอบให้เราสองคนนะคะ'
                    : "Even though we won't be able to celebrate together in person, thank you so much for your heartfelt blessings and warm wishes."}
                </p>

                {/* Optional Wishes Preview if guest wrote a blessing */}
                {submittedData.wishes && (
                  <div className="bg-white dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-left shadow-2xs mt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <MessageSquare className="w-3 h-3 text-[#0074E2] dark:text-[#38BDF8]" />
                      <span>{lang === 'th' ? 'คำอวยพรของคุณ' : 'Your Wishes'}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed break-words line-clamp-3">
                      &ldquo;{submittedData.wishes}&rdquo;
                    </p>
                  </div>
                )}

                {/* Heartfelt closing blessing */}
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-[13px] font-semibold text-rose-500 pt-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
                  <span>{lang === 'th' ? 'ขอให้คุณมีความสุขและความอบอุ่นเช่นกันเสมอ' : 'Wishing you endless joy & happiness too'}</span>
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse shrink-0" />
                </div>
              </div>

              {/* Fastwork Blue Signature CTA Button */}
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={closeSuccessModal}
                  className="w-full py-3 sm:py-3.5 px-6 rounded-full bg-[#0074E2] hover:bg-[#0060B8] active:bg-[#00529D] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#0074E2]/25 ring-2 ring-[#0074E2]/20 transition-all duration-200 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{lang === 'th' ? 'กลับสู่หน้าหลัก' : 'Back to Home'}</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center my-auto py-1 sm:py-2 px-1 w-full shrink-0"
            >
              {/* Top Close Button (Floating in Dark Backdrop) */}
              <div className="w-full max-w-[340px] sm:max-w-[390px] flex justify-end mb-1 sm:mb-1.5 z-40">
                <button
                  type="button"
                  onClick={closeSuccessModal}
                  aria-label="Close ticket modal"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* =========================================================
                1. REALISTIC CHROME / METALLIC DISPENSER SLOT (Printer Head)
               ========================================================= */}
              <div className="relative w-full max-w-[340px] sm:max-w-[390px] z-30">
                {/* Metallic Beveled Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-5 sm:h-6.5 rounded-t-xl bg-gradient-to-b from-[#F1F5F9] via-[#CBD5E1] to-[#94A3B8] p-0.5 sm:p-1 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.95)] border border-slate-300 flex items-center justify-center relative"
                >
                  {/* Metallic Screws / Rivets on Left & Right */}
                  <div className="absolute left-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300 border border-slate-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
                    <div className="w-1 h-0.5 bg-slate-600 rounded-xs rotate-45" />
                  </div>
                  <div className="absolute right-2.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300 border border-slate-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
                    <div className="w-1 h-0.5 bg-slate-600 rounded-xs -rotate-45" />
                  </div>

                  {/* Dark Recessed Printing Dispenser Slit */}
                  <div className="w-[88%] h-2 sm:h-2.5 bg-[#0B0F19] rounded-xs shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] border border-slate-700/80 flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-0.5 bg-black/90" />
                    {/* Active Printing Feed Glow */}
                    <motion.div
                      initial={{ opacity: 0.7, x: '-100%' }}
                      animate={{ opacity: [0.7, 0.25, 0.7], x: ['-100%', '100%'] }}
                      transition={{ duration: 1.55, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
                    />
                  </div>
                </motion.div>
                {/* Soft Drop Shadow below Metallic Slit */}
                <div className="h-1 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
              </div>

              {/* =========================================================
                2. PRINTED CONCERT TICKET / BOARDING PASS
                   Smooth continuous printing feed from the silver dispenser
               ========================================================= */}
              <div className="w-full max-w-[340px] sm:max-w-[390px] -mt-0.5 relative z-20 overflow-hidden">
                <motion.div
                  initial={{ y: '-100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1.55,
                    ease: [0.25, 1, 0.35, 1],
                  }}
                  className="w-full"
                >
                  <div
                    ref={ticketCardRef}
                    className="bg-[#FFFFFF] rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.55)] border-2 border-slate-300 text-slate-900 px-4 sm:px-6 pt-3.5 sm:pt-4.5 pb-4 sm:pb-5 relative select-none"
                  >
                    {/* 1. Top Dotted Line with Airplane Emblem */}
                    <div className="flex items-center justify-between text-slate-400 pb-2 sm:pb-2.5 border-b border-dotted border-slate-300">
                      <div className="flex-1 border-b border-dotted border-slate-400" />
                      <div className="mx-2.5 w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                      </div>
                      <div className="flex-1 border-b border-dotted border-slate-400" />
                    </div>

                    {/* Subtitle: BOARDING PASS */}
                    <p className="text-[8px] sm:text-[9.5px] font-mono tracking-[0.32em] text-slate-600 font-bold uppercase text-center mt-1.5 sm:mt-2">
                      B O A R D I N G &nbsp; P A S S
                    </p>

                    {/* 2. Main Title: AM2027 WEDDING on Powder Blue Washi Tape Strips (matching reference font & style) */}
                    <div className="flex flex-col items-center my-2 sm:my-2.5 -rotate-[2.2deg]">
                      {/* Line 1: AM2027 in Impact / Condensed Heavy Black font */}
                      <div className="relative inline-flex items-center justify-center px-4 sm:px-5 py-0.5">
                        <svg
                          viewBox="0 0 160 38"
                          preserveAspectRatio="none"
                          className="absolute inset-0 w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] pointer-events-none"
                        >
                          {/* Torn Washi Masking Tape with Jagged Edges */}
                          <path
                            d="M 5,2 Q 15,0 30,1 L 135,0 Q 150,1 155,3 L 153,10 L 157,18 L 154,27 L 156,34 Q 140,35 120,34 L 25,36 Q 10,35 4,33 L 7,24 L 3,16 L 6,8 Z"
                            fill="#A0C0D6"
                            fillOpacity="0.9"
                          />
                        </svg>
                        <span
                          className="relative z-10 font-black text-2xl sm:text-[34px] text-slate-950 tracking-tight leading-none block select-none uppercase"
                          style={{ fontFamily: 'Impact, "Arial Narrow Bold", sans-serif' }}
                        >
                          AM2027
                        </span>
                      </div>

                      {/* Line 2: WEDDING in Impact / Condensed Heavy Black font */}
                      <div className="relative inline-flex items-center justify-center px-5 sm:px-6 py-0.5 -mt-0.5">
                        <svg
                          viewBox="0 0 160 34"
                          preserveAspectRatio="none"
                          className="absolute inset-0 w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] pointer-events-none"
                        >
                          {/* Torn Washi Masking Tape with Jagged Edges */}
                          <path
                            d="M 4,2 Q 18,1 35,2 L 130,1 Q 148,2 156,4 L 154,10 L 157,18 L 153,25 L 155,31 Q 138,32 115,31 L 20,33 Q 8,32 4,30 L 6,22 L 3,13 L 5,6 Z"
                            fill="#A0C0D6"
                            fillOpacity="0.9"
                          />
                        </svg>
                        <span
                          className="relative z-10 font-black text-lg sm:text-[25px] text-slate-950 tracking-wider leading-none block select-none uppercase"
                          style={{ fontFamily: 'Impact, "Arial Narrow Bold", sans-serif' }}
                        >
                          WEDDING
                        </span>
                      </div>

                      {/* Subtitle Venue & City matching reference */}
                      <span className="text-[#0074E2] font-black text-[9px] sm:text-[11px] tracking-[0.22em] uppercase mt-1.5 rotate-[2.2deg]">
                        LE PASIRI • NONTHABURI
                      </span>
                    </div>

                    {/* 3. 3D Cartoon Bride & Groom wearing Sunglasses (Visual Centerpiece) */}
                    <div className="my-1.5 sm:my-2 flex justify-center">
                      <div className="relative w-36 h-36 sm:w-48 sm:h-48 max-h-[22vh] flex items-center justify-center">
                        <img
                          src="/images/cartoon-couple.png"
                          alt="Aomsin & Mild Wedding Tour"
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.20)] hover:scale-105 transition-transform duration-300"
                          loading="eager"
                          decoding="async"
                        />
                      </div>
                    </div>

                    {/* 4. Concert Boarding Pass Grid Table with Thin Black Borders & Layout matching reference */}
                    <div className="border-t border-b border-black text-left font-mono my-2 sm:my-2.5 text-slate-900">
                      {/* Row 1: Venue & Date */}
                      <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
                        <div className="py-1.5 sm:py-2 px-2.5 sm:px-3">
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-500 uppercase tracking-wider block font-bold leading-none">VENUE:</span>
                          <span className="text-[11px] sm:text-[13px] font-black text-slate-900 uppercase block leading-tight mt-1">
                            LE PASIRI
                          </span>
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-600 uppercase block font-semibold leading-none mt-0.5">NONTHABURI</span>
                        </div>
                        <div className="py-1.5 sm:py-2 px-2.5 sm:px-3">
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-500 uppercase tracking-wider block font-bold leading-none">DATE:</span>
                          <span className="text-[11px] sm:text-[13px] font-black text-slate-900 uppercase block leading-tight mt-1">
                            23 JAN 2027
                          </span>
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-600 uppercase block font-semibold leading-none mt-0.5">SATURDAY</span>
                        </div>
                      </div>

                      {/* Row 2: Ceremony & Reception Times */}
                      <div className="grid grid-cols-2 divide-x divide-black border-b border-black">
                        <div className="py-1.5 sm:py-2 px-2.5 sm:px-3">
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-500 uppercase tracking-wider block font-bold leading-none">CEREMONY TIME:</span>
                          <span className="text-[11px] sm:text-[13px] font-black text-slate-900 uppercase block mt-1 leading-tight">
                            15:30
                          </span>
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-600 uppercase block font-semibold leading-none mt-0.5">03:30 PM</span>
                        </div>
                        <div className="py-1.5 sm:py-2 px-2.5 sm:px-3">
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-500 uppercase tracking-wider block font-bold leading-none">RECEPTION TIME:</span>
                          <span className="text-[11px] sm:text-[13px] font-black text-slate-900 uppercase block mt-1 leading-tight">
                            18:30
                          </span>
                          <span className="text-[7.5px] sm:text-[8.5px] text-slate-600 uppercase block font-semibold leading-none mt-0.5">06:30 PM</span>
                        </div>
                      </div>

                      {/* Row 3: Passenger Guest & Flight Code + QR */}
                      <div className="py-2.5 sm:py-3 px-3 sm:px-4 w-full">
                        <span className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wider block font-bold leading-none">
                          PASSENGER:
                        </span>
                        <h3 className="text-base sm:text-xl font-black text-slate-950 tracking-tight block leading-tight mt-1 truncate">
                          คุณ {submittedData.fullName} {submittedData.nickname ? `(${submittedData.nickname})` : ''}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          <span className="text-[8.5px] sm:text-[9.5px] font-black text-[#0074E2] leading-none font-mono">
                            ADMIT: {submittedData.guestCount} TICKET(S)
                          </span>
                          <span className="text-[7px] sm:text-[7.5px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 leading-none">
                            {submittedData.attending === 'yes' ? 'CONFIRMED' : 'DECLINED'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wishes Section (if provided - max 2 lines with ellipsis) */}
                    {submittedData.wishes && (
                      <div className="my-1.5 sm:my-2 text-center bg-slate-50 rounded-lg p-1.5 sm:p-2 border border-slate-200 text-slate-700">
                        <span className="text-[7px] sm:text-[7.5px] uppercase tracking-[0.16em] text-slate-500 font-mono block font-bold leading-none">
                          GUEST WISH • คำอวยพร
                        </span>
                        <p className="text-[8.5px] sm:text-[9.5px] italic text-slate-800 mt-1 leading-snug line-clamp-2 break-words">
                          &ldquo;{submittedData.wishes}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Footer Copyright */}
                    <div className="text-center pt-2.5 mt-2">
                      <p className="text-[7.5px] sm:text-[8.5px] font-mono tracking-wider text-slate-400 uppercase">
                        © AOMSIN &amp; MILD WEDDING. ALL RIGHTS RESERVED.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* =========================================================
                3. ACTION BUTTONS (Save Ticket & Close)
                   Appears smoothly right after ticket finishes printing
               ========================================================= */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.56, duration: 0.28, ease: 'easeOut' }}
                className="w-full max-w-[340px] sm:max-w-[390px] mt-2 sm:mt-3 space-y-1 sm:space-y-1.5 z-30"
              >
                {/* Save / Download Ticket Image Button */}
                <button
                  type="button"
                  onClick={downloadTicketImage}
                  disabled={isDownloadingTicket}
                  className={`w-full py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${isTicketDownloaded
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-[#0074E2] hover:bg-[#0060B8] text-white ring-2 ring-[#0074E2]/40 shadow-md shadow-[#0074E2]/25'
                    }`}
                >
                  {isTicketDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                      <span>บันทึกบัตรคอนเสิร์ตลงเครื่องแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                      <span>บันทึกรูปภาพบัตรเชิญ (SAVE IMAGE)</span>
                    </>
                  )}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeSuccessModal}
                  className="w-full py-1 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[11px] sm:text-xs font-medium tracking-wide transition-colors cursor-pointer border border-white/15"
                >
                  {t('rsvp.done', 'เสร็จสิ้น')}
                </button>
              </motion.div>
            </div>
          )
        )}
      </dialog>

      {/* iOS Save to Photos Helper Modal (for HTTP local testing & In-App Browsers) */}
      <AnimatePresence>
        {showIosSaveModal && iosTicketPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIosSaveModal(false)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl z-10 flex flex-col items-center border border-slate-200 dark:border-slate-800"
            >
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📸</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    บันทึกลง Photos บน iPhone
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIosSaveModal(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Instructions banner */}
              <div className="w-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700/50 rounded-xl p-2.5 mb-2.5 text-center">
                <p className="text-xs font-bold text-[#0074E2] dark:text-[#38BDF8]">
                  👆 แตะค้างที่รูปภาพ แล้วเลือก &ldquo;บันทึกไปยัง รูปภาพ&rdquo;
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">
                  หรือกดปุ่มสีฟ้าด้านล่างเพื่อเปิดรูปแล้วกดบันทึก
                </p>
              </div>

              {/* Rendered image ready for touch and hold */}
              <div
                className="w-full max-h-[48vh] overflow-y-auto flex justify-center rounded-xl bg-slate-50 dark:bg-slate-950 p-1.5 border border-slate-200 dark:border-slate-800 shadow-inner"
                style={{ WebkitTouchCallout: 'default', WebkitUserSelect: 'auto', userSelect: 'auto' }}
              >
                <img
                  src={iosTicketPreview}
                  alt="Aomsin & Mild Wedding Ticket"
                  style={{ WebkitTouchCallout: 'default', WebkitUserSelect: 'auto', userSelect: 'auto' }}
                  className="w-auto max-h-[44vh] object-contain rounded-lg shadow-md pointer-events-auto cursor-pointer"
                />
              </div>

              {/* Action buttons */}
              <div className="w-full mt-3 space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    window.open(iosTicketPreview, '_blank');
                  }}
                  className="w-full py-2.5 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดรูปในแท็บใหม่ (แล้วกดบันทึกภาพ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = iosTicketPreview;
                    link.download = `wedding-ticket-${(submittedData?.fullName || 'guest').replace(/\s+/g, '_')}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์ลงเครื่อง</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowIosSaveModal(false)}
                  className="w-full py-1.5 rounded-full text-slate-400 hover:text-slate-600 text-[10.5px] font-medium transition-colors cursor-pointer"
                >
                  เสร็จสิ้น / ปิดหน้าต่าง
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
