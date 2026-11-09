import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

export default function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleToggle = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    const state = weddingAudio.toggle();
    setIsPlaying(state);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      {/* Tooltip prompt for guests */}
      {showTooltip && !hasInteracted && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs tracking-wider uppercase text-[#2D2926] shadow-md border border-[#E8E2D8] animate-bounce">
          <Music className="w-3.5 h-3.5 text-[#C8B89E]" />
          <span>Play Wedding Melodies</span>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mute ambient wedding music' : 'Play ambient wedding music'}
        className={`group relative flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
          isPlaying
            ? 'bg-[#2D2926] text-[#FAF8F5] border border-[#2D2926] ring-2 ring-[#C8B89E]/40'
            : 'bg-white/90 text-[#2D2926] border border-[#E8E2D8] hover:bg-white hover:border-[#C8B89E]'
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 animate-pulse text-[#C8B89E]" />
            {/* Visual sound waves radiating */}
            <span className="absolute -inset-1 rounded-full border border-[#C8B89E]/50 animate-ping opacity-30 pointer-events-none" />
          </>
        ) : (
          <VolumeX className="w-4 h-4 text-[#2D2926]/70 group-hover:text-[#2D2926]" />
        )}
      </button>
    </div>
  );
}
