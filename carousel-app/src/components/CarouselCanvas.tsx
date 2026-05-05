import React from 'react';
import type { SlideData, DesignSystem } from '../types';
import Slide from './Slide';

interface CarouselCanvasProps {
  slides: SlideData[];
  designSystem: DesignSystem;
  onUpdateSlide: (id: string, updates: Partial<SlideData>) => void;
}

const CarouselCanvas: React.FC<CarouselCanvasProps> = ({ slides, designSystem, onUpdateSlide }) => {
  // REVERTED: Scale is now fixed at 0.4 for a consistent high-end preview feel
  const fixedScale = 0.4;

  return (
    <div className="flex-1 h-full overflow-hidden bg-[#111] flex flex-col items-center justify-center relative">
      
      {/* Scrollable Container - Standardized for all screen sizes */}
      <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-start py-20 px-40">
        <div 
          className="flex gap-20 transition-transform duration-300 ease-out" 
          id="carousel-export-container"
          style={{ 
            transform: `scale(${fixedScale})`, 
            transformOrigin: 'left center',
            width: 'max-content',
            padding: '100px 0'
          }}
        >
          {slides.map((slide, index) => (
            <Slide 
              key={slide.id} 
              slide={slide} 
              designSystem={designSystem} 
              index={index} 
              totalSlides={slides.length}
              onUpdate={(updates) => onUpdateSlide(slide.id, updates)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 pointer-events-none">
         <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#fcf5ee]">
           Canvas Editor — 1080x1350 Fixed Scale
         </div>
         <div className="text-[10px] font-bold tracking-widest uppercase text-[#fcf5ee]">
            Scale: {fixedScale * 100}% — Swipe or Scroll horizontally
         </div>
      </div>
    </div>
  );
};

export default CarouselCanvas;
