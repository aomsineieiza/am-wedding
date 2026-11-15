import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Gallery() {
  const { gallery } = weddingData;
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const dialogRef = useRef(null);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedPhoto(null);
  };

  const handleDialogBackdropClick = (e) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      closeModal();
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = gallery.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
    setSelectedPhoto(gallery[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = gallery.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % gallery.length;
    setSelectedPhoto(gallery[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <section id="gallery" className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Section Header (Korean Minimalist Style) */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FAFAFB] text-[#52525B] text-[11px] font-medium tracking-[0.28em] uppercase mb-3 border border-[#E2E5E9]"
          >
            <span>MOMENTS</span>
            <span className="text-[9px]">♥</span>
            <span>GALLERY</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-[#27272A] tracking-tight"
          >
            ภาพความประทับใจ
          </motion.h2>
          <p className="text-sm text-[#71717A] mt-2 font-normal">
            ช่วงเวลาแห่งความสุขที่บันทึกไว้ในทุกมุมมอง
          </p>
        </div>

        {/* Gallery Grid (Korean Minimalist Matte Paper Passe-Partout Frames) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-7">
          {gallery.map((photo, index) => {
            const spanClass =
              gallery.length === 5 && index === 3
                ? 'lg:col-start-2 lg:col-span-2'
                : 'lg:col-span-2';

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                onClick={() => openModal(photo)}
                className={`${spanClass} group cursor-pointer bg-[#FAFAFB] p-5 sm:p-6 rounded-[30px] border border-[#E2E5E9] hover:border-[#A1A1AA] shadow-[0_12px_35px_-10px_rgba(30,41,59,0.06),inset_0_1px_0_#FFFFFF] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center`}
              >
                {/* Top Minimalist Number Tag */}
                <span className="text-[10px] tracking-[0.3em] text-[#9CA3AF] uppercase mb-3 font-medium">
                  0{index + 1} &nbsp;•&nbsp; A &amp; M
                </span>

                {/* Recessed Die-Cut Arch / Capsule Photo Window */}
                <div className="diecut-window-outer w-full p-2.5 rounded-[999px] mb-4">
                  <div className="diecut-window-inner relative aspect-[3/4] rounded-[999px] overflow-hidden bg-[#E5E7EB]">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 ${
                        photo.objectPosition || 'object-center'
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5 text-white">
                      <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minimalist Caption Below Window */}
                <p className="font-editorial-serif text-lg font-semibold text-[#27272A] tracking-wide">
                  {photo.title}
                </p>
                <p className="text-xs text-[#71717A] font-light mt-0.5 line-clamp-1">
                  {photo.caption}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modern Dialog Lightbox Modal */}
      <dialog
        ref={dialogRef}
        aria-labelledby="lightbox-title"
        closedby="any"
        onClick={handleDialogBackdropClick}
        className="fixed inset-0 m-auto max-w-4xl w-[92vw] sm:w-[85vw] max-h-[90vh] bg-transparent p-0 rounded-3xl shadow-2xl border-0 outline-none backdrop:bg-slate-950/80 backdrop:backdrop-blur-md"
      >
        {selectedPhoto && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <div>
                <h3 id="lightbox-title" className="text-lg font-bold text-slate-900">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedPhoto.caption}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close photo preview"
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center min-h-[350px] sm:min-h-[500px] overflow-hidden">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
