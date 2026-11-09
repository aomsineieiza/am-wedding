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
    if (window.confirm('Clear all stored RSVP records on this device?')) {
      localStorage.removeItem('wedding_rsvps');
      setRsvps([]);
    }
  };

  const handleExportCSV = () => {
    if (rsvps.length === 0) {
      alert('No RSVP records to export yet.');
      return;
    }

    const headers = ['Full Name', 'Contact', 'Attending', 'Guests Count', 'Dietary Restrictions', 'Wishes', 'Date Submitted'];
    const rows = rsvps.map((r) => [
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${(r.contact || '').replace(/"/g, '""')}"`,
      r.attending === 'yes' ? 'Attending' : 'Declined',
      r.guestCount || 1,
      `"${(r.dietary || '').replace(/"/g, '""')}"`,
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
      {/* Discreet footer trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="text-[11px] text-white/40 hover:text-white/80 transition-colors inline-flex items-center gap-1 mt-4 underline underline-offset-4"
      >
        <Shield className="w-3 h-3" />
        <span>RSVP Responses Summary ({rsvps.length || 0})</span>
      </button>

      {/* Native <dialog> Modal */}
      <dialog
        ref={dialogRef}
        aria-labelledby="admin-modal-title"
        closedby="any"
        className="fixed inset-0 m-auto max-w-2xl w-[92vw] max-h-[85vh] bg-transparent p-0 rounded-3xl border-0 outline-none backdrop:bg-black/60 backdrop:backdrop-blur-md"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-2xl flex flex-col max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C8B89E]" />
              <h3 id="admin-modal-title" className="font-serif text-xl sm:text-2xl text-[#2D2926]">
                RSVP Guestlist Summary
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-center text-[#2D2926] hover:bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] text-center">
              <span className="text-[10px] uppercase tracking-wider text-[#A38F70] block">Total Responses</span>
              <span className="font-serif text-xl sm:text-2xl text-[#2D2926] font-medium">{rsvps.length}</span>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 block">Attending Guests</span>
              <span className="font-serif text-xl sm:text-2xl text-emerald-700 font-medium">{attendingCount}</span>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] text-center">
              <span className="text-[10px] uppercase tracking-wider text-rose-500 block">Declined</span>
              <span className="font-serif text-xl sm:text-2xl text-rose-600 font-medium">{declinedCount}</span>
            </div>
          </div>

          {/* Table of Submissions */}
          <div className="flex-1 overflow-y-auto min-h-[150px] border border-[#E8E2D8] rounded-xl">
            {rsvps.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6B635B]">
                No RSVPs submitted yet. Fill out the RSVP form on the site to see responses recorded here!
              </div>
            ) : (
              <div className="divide-y divide-[#E8E2D8]">
                {rsvps.map((entry, i) => (
                  <div key={i} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF8F5]">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-serif text-[#2D2926]">{entry.fullName}</strong>
                        {entry.attending === 'yes' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {entry.guestCount} Guest{entry.guestCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-medium border border-rose-200">
                            <XCircle className="w-2.5 h-2.5" /> Declined
                          </span>
                        )}
                      </div>
                      <p className="text-[#6B635B] text-[11px]">{entry.contact}</p>
                      {entry.dietary && (
                        <p className="text-amber-700 text-[10px] mt-0.5">Dietary: {entry.dietary}</p>
                      )}
                      {entry.wishes && (
                        <p className="italic text-[#A38F70] text-[11px] mt-1">&ldquo;{entry.wishes}&rdquo;</p>
                      )}
                    </div>
                    <span className="text-[10px] text-[#A38F70] shrink-0 font-mono">
                      {entry.submittedAt ? new Date(entry.submittedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-4 border-t border-[#E8E2D8] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 font-sans"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Data</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-5 py-2 rounded-full bg-[#2D2926] hover:bg-[#A38F70] text-white text-xs font-sans uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#C8B89E]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
