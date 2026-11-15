import React, { useState, useEffect, useRef } from 'react';
import { Download, Users, CheckCircle2, XCircle, X, Shield, Trash2 } from 'lucide-react';

export default function RSVPAdminModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const dialogRef = useRef(null);

  const loadRSVPs = () => {
    try {
      const data = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      setRsvps(data);
    } catch {
      setRsvps([]);
    }
  };

  const handleOpen = () => {
    loadRSVPs();
    setIsOpen(true);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleClear = () => {
    if (window.confirm('ลบข้อมูล RSVP ทั้งหมดที่บันทึกไว้ในอุปกรณ์นี้หรือไม่?')) {
      localStorage.removeItem('wedding_rsvps');
      setRsvps([]);
    }
  };

  const handleExportCSV = () => {
    if (rsvps.length === 0) {
      alert('ยังไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = ['Full Name', 'Contact', 'Attending', 'Guests Count', 'Wishes', 'Date Submitted'];
    const rows = rsvps.map((r) => [
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${(r.contact || '').replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'Attending' : 'Declined',
      r.guestCount || 1,
      `"${(r.wishes || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wedding-rsvps-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attendingCount = rsvps.filter((r) => r.attending === 'yes').reduce((sum, r) => sum + (parseInt(r.guestCount) || 1), 0);
  const declinedCount = rsvps.filter((r) => r.attending === 'no').length;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 mt-4 underline underline-offset-4 cursor-pointer"
      >
        <Shield className="w-3.5 h-3.5" />
        <span>ดูรายชื่อผู้ตอบรับคำเชิญ • RSVP Summary ({rsvps.length || 0})</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="admin-modal-title"
        closedby="any"
        className="fixed inset-0 m-auto max-w-2xl w-[92vw] max-h-[85vh] bg-transparent p-0 rounded-3xl border-0 outline-none backdrop:bg-slate-950/70 backdrop:backdrop-blur-md"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0074E2]" />
              <h3 id="admin-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900">
                สรุปรายชื่อผู้ตอบรับ (RSVP Summary)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">ผู้ตอบรับทั้งหมด</span>
              <span className="text-xl sm:text-2xl text-slate-900 font-bold">{rsvps.length}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 font-semibold block">ยอดผู้มาร่วมงาน</span>
              <span className="text-xl sm:text-2xl text-emerald-700 font-bold">{attendingCount}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase tracking-wider text-rose-500 font-semibold block">ไม่สะดวก</span>
              <span className="text-xl sm:text-2xl text-rose-600 font-bold">{declinedCount}</span>
            </div>
          </div>

          {/* Table of Submissions */}
          <div className="flex-1 overflow-y-auto min-h-[150px] border border-slate-200 rounded-2xl">
            {rsvps.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                ยังไม่มีข้อมูล RSVP บันทึกไว้
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {rsvps.map((entry, i) => (
                  <div key={i} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-slate-900">{entry.fullName}</strong>
                        {entry.attending === 'yes' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {entry.guestCount} ท่าน
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">
                            <XCircle className="w-2.5 h-2.5" /> ไม่สะดวก
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{entry.contact}</p>
                      {entry.wishes && (
                        <p className="italic text-slate-600 text-[11px] mt-1">&ldquo;{entry.wishes}&rdquo;</p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {entry.submittedAt ? new Date(entry.submittedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างข้อมูล</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-5 py-2 rounded-full bg-[#0074E2] hover:bg-[#0060B8] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออกไฟล์ CSV (Excel)</span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
