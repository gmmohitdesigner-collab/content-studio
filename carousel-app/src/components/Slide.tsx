import React from 'react';
import type { SlideData, DesignSystem } from '../types';

interface SlideProps {
  slide: SlideData;
  designSystem: DesignSystem;
  index: number;
  totalSlides: number;
  onUpdate?: (updates: Partial<SlideData>) => void;
}

export const getSpringPath = (stiffness: number, damping: number, mass: number, width: number, height: number) => {
  const startY = height * 0.8;
  const endY = height * 0.2;
  const controlX = (damping / 50) * width;
  const controlY = height - (stiffness / 200) * height + (mass * 5);
  return `M 0 ${startY} Q ${controlX} ${controlY} ${width} ${endY}`;
};

const Slide: React.FC<SlideProps> = ({ slide, designSystem, index, totalSlides, onUpdate }) => {
  const layout = slide.layoutType || 'default';
  const bgColor = '#3f352c'; 
  const accentColor = designSystem.primaryColor;

  const showGrid = slide.showGrid !== undefined ? slide.showGrid : designSystem.showGlobalGrid;

  const handleTextUpdate = (field: keyof SlideData, e: React.FormEvent<HTMLDivElement>) => {
    if (onUpdate) {
      onUpdate({ [field]: e.currentTarget.innerText });
    }
  };

  const panoramaStyles = slide.panoramaMode && slide.image ? {
    backgroundImage: `url(${slide.image})`,
    backgroundSize: `${totalSlides * 100}% 100%`,
    backgroundPosition: `${totalSlides > 1 ? (index / (totalSlides - 1)) * 100 : 0}% center`,
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div 
      className="slide-container relative flex flex-col justify-between overflow-hidden shadow-2xl flex-shrink-0 cursor-default group"
      style={{ 
        width: '1080px', 
        height: '1350px', 
        backgroundColor: slide.panoramaMode ? 'transparent' : bgColor,
        ...panoramaStyles
      }}
      id={`slide-${slide.id}`}
    >
      {showGrid && (
        <div 
          className="absolute inset-0 opacity-[0.05] transition-opacity duration-500 z-0" 
          style={{ 
            backgroundImage: `linear-gradient(${designSystem.gridColor} ${designSystem.gridStroke}px, transparent ${designSystem.gridStroke}px), linear-gradient(90deg, ${designSystem.gridColor} ${designSystem.gridStroke}px, transparent ${designSystem.gridStroke}px)`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      )}
      
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      {/* HEADER */}
      <div className="p-16 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <div 
            contentEditable suppressContentEditableWarning
            onBlur={(e) => handleTextUpdate('subtitle', e)}
            className="text-[14px] font-bold tracking-[0.4em] uppercase opacity-40 text-[#fcf5ee] outline-none"
          >
            {slide.subtitle || 'CINEMATIC PERSPECTIVE'}
          </div>
          <div className="w-16 h-[2px] bg-[#fcf5ee] opacity-30"></div>
        </div>
        <div className="text-[40px] font-monument text-[#fcf5ee] opacity-10">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 px-16 flex flex-col justify-center z-10">
        {layout === 'romina-hook' ? (
          <div className="space-y-12 text-center">
            <h1 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate('title', e)}
              className="text-[160px] font-monument leading-[0.75] tracking-[-0.06em] uppercase italic outline-none"
              style={{ color: accentColor }}
            >
              {slide.title}
            </h1>
            <div 
              contentEditable suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate('content', e)}
              className="text-[42px] leading-tight opacity-90 max-w-[900px] text-[#fcf5ee] outline-none mx-auto"
            >
              {slide.content}
            </div>
          </div>
        ) : layout === 'romina-sticky' ? (
          <div className="relative flex justify-center items-center h-full py-20 px-10">
            {/* The Sticky Note - Refined for Image 655162977 Fidelity */}
            <div className="relative bg-[#fcf5ee] text-[#3f352c] p-24 pt-32 rounded-[8px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.45)] rotate-[-0.8deg] w-[880px] min-h-[780px] flex flex-col z-10">
              
              {/* Refined 3D Paperclip */}
              <div className="absolute top-[-40px] left-[18%] w-12 h-36 pointer-events-none z-[30]">
                 <div className="absolute inset-0 border-4 border-[#3f352c]/10 rounded-full z-[-1] translate-y-2"></div> {/* Back loop */}
                 <div className="absolute inset-0 border-4 border-[#3f352c]/70 rounded-full bg-transparent h-[68%] border-b-0 z-[40]"></div> {/* Front loop */}
              </div>

              {/* Title Section with Line Divider */}
              <div className="flex flex-col items-center gap-10 mb-16">
                 <h1 
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => handleTextUpdate('title', e)}
                  className="text-[110px] font-monument leading-none uppercase italic tracking-tighter outline-none"
                 >
                   {slide.title}
                 </h1>
                 <div className="w-full h-[3px] bg-[#3f352c]/5 rounded-full"></div>
              </div>

              {/* Content Section with Bullet Formatting */}
              <div 
                contentEditable suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('content', e)}
                className="text-[44px] leading-[1.6] font-bold text-center whitespace-pre-wrap outline-none"
              >
                {slide.content}
              </div>
            </div>
          </div>
        ) : layout === 'romina-table' ? (
          <div className="space-y-12 w-full">
            <h2 className="text-[72px] font-monument leading-none uppercase text-[#fcf5ee] mb-12 italic opacity-90">{slide.title}</h2>
            <div className="border border-[#fcf5ee]/20 rounded-[40px] overflow-hidden backdrop-blur-xl bg-[#fcf5ee]/5">
               <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#fcf5ee]/10 border-b border-[#fcf5ee]/20 text-[20px] font-monument uppercase tracking-widest text-[#fcf5ee]">
                      <th className="p-10 text-left">{slide.tableData?.headers?.[0] || 'SIDE A'}</th>
                      <th className="p-10 text-left">{slide.tableData?.headers?.[1] || 'SIDE B'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(slide.tableData?.rows || [['Feature A', 'Feature B']]).map((row, i) => (
                      <tr key={i} className="border-b border-[#fcf5ee]/10 last:border-0 hover:bg-[#fcf5ee]/5 transition-colors text-[28px] text-[#fcf5ee]/80">
                        <td className="p-10 font-medium">{row?.[0] || '-'}</td>
                        <td className="p-10 font-medium">{row?.[1] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : layout === 'chart' ? (
          <div className="space-y-16">
            <h1 className="text-[80px] font-monument uppercase italic text-center mb-16">{slide.title}</h1>
            <div className="h-[500px] w-full relative px-24">
               <div className="absolute left-6 top-0 h-full w-[2px] bg-white/10 flex flex-col justify-between py-10 text-[18px] text-white/30 font-black tracking-[0.5em] uppercase">
                  <span className="rotate-[-90deg] translate-x-[-30px] whitespace-nowrap">{slide.chartData?.yAxisLabel || 'RETENTION'}</span>
               </div>
               <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
                      <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map(i => (
                    <line key={i} x1="0" y1={i * 100 + 50} x2="1000" y2={i * 100 + 50} stroke="white" strokeOpacity="0.05" strokeWidth="2" />
                  ))}
                  <path 
                    d={getSpringPath(slide.chartData?.stiffness || 100, slide.chartData?.damping || 15, slide.chartData?.mass || 1, 1000, 400)} 
                    fill="none" stroke="url(#curveGradient)" strokeWidth="14" strokeLinecap="round" className="opacity-90 shadow-2xl"
                  />
                  <line x1="0" y1="380" x2="1000" y2="380" stroke="white" strokeOpacity="0.2" strokeWidth="4" />
               </svg>
               <div className="absolute bottom-[-50px] left-24 right-24 flex justify-between text-[16px] text-white/40 font-black tracking-[0.6em] uppercase">
                  <span>0:00</span>
                  <span>{slide.chartData?.xAxisLabel || 'TIME'}</span>
                  <span>0:60</span>
               </div>
            </div>
            <div className="text-[36px] leading-relaxed opacity-80 italic text-center max-w-[850px] mx-auto mt-24 border-t border-white/5 pt-12">{slide.content}</div>
          </div>
        ) : (
          <div className="max-w-[900px] space-y-16">
            <h1 className="text-[120px] font-monument leading-[0.9] tracking-[-0.04em] uppercase" style={{ color: accentColor }}>{slide.title}</h1>
            <div className="text-[44px] leading-[1.4] opacity-80 font-medium text-[#fcf5ee] whitespace-pre-wrap">{slide.content}</div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-16 z-10 flex justify-between items-end text-[#fcf5ee]">
        <div className="flex flex-col gap-4">
          <span className="text-[20px] font-bold font-monument tracking-tight">@GMMohit</span>
          <div className="flex gap-2">
             {Array.from({ length: totalSlides }).map((_, i) => (
               <div key={i} className="h-[6px] rounded-full transition-all duration-500"
                    style={{ width: i === index ? '80px' : '20px', backgroundColor: i === index ? accentColor : 'rgba(252, 245, 238, 0.1)' }}></div>
             ))}
          </div>
        </div>
        {totalSlides > 1 && (
          <div className="px-10 py-5 bg-[#fcf5ee]/5 rounded-full text-[14px] font-bold tracking-[0.5em] uppercase opacity-30 border border-white/5">SWIPE LEFT</div>
        )}
      </div>
    </div>
  );
};

export default Slide;
