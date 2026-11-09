import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export default function Gallery() {
  const { gallery } = weddingData;
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const dialogRef = useRef(null);

  // Modern Dialog open/close management
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

  // Light dismiss fallback for backdrop clicks
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

  // Next / Previous navigation
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

  // Keyboard navigation
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
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#F7F4EF]/70">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] text-[#A38F70] font-medium mb-3"
          >
            Memories in Motion
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl text-[#2D2926] font-light tracking-tight"
          >
            Curated Gallery
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-16 h-px bg-[#C8B89E] mx-auto mt-6"
          />
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gallery.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              onClick={() => openModal(photo)}
              className="group cursor-pointer relative bg-white p-2.5 rounded-2xl shadow-md shadow-[#2D2926]/5 border border-[#E8E2D8] hover:shadow-xl hover:border-[#C8B89E] transition-all duration-500"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF8F5]">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-serif text-xl tracking-wide">{photo.title}</p>
                      <p className="text-xs text-white/80 tracking-wider font-light mt-0.5">
                        {photo.caption}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Native <dialog> Modal for Lightbox Preview per Modern Web Standards */}
      <dialog
        ref={dialogRef}
        aria-labelledby="lightbox-title"
        closedby="any"
        onClick={handleDialogBackdropClick}
        className="fixed inset-0 m-auto max-w-4xl w-[92vw] sm:w-[85vw] max-h-[90vh] bg-transparent p-0 rounded-2xl shadow-2xl border-0 outline-none backdrop:bg-black/80 backdrop:backdrop-blur-md"
      >
        {selectedPhoto && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF8F5]">
              <div>
                <h3 id="lightbox-title" className="font-serif text-xl text-[#2D2926]">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-[#6B635B]">{selectedPhoto.caption}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close photo preview"
                className="w-9 h-9 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center text-[#2D2926] hover:bg-[#FAF8F5] hover:border-[#C8B89E] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative flex-1 bg-[#2D2926] flex items-center justify-center min-h-[350px] sm:min-h-[500px] overflow-hidden">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2D2926] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#2D2926] flex items-center justify-center shadow-lg transition-transform hover:scale-105"
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

