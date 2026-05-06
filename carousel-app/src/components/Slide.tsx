import React from 'react';
import type { SlideData, DesignSystem } from '../types';

interface SlideProps {
  slide: SlideData;
  designSystem: DesignSystem;
  index: number;
  totalSlides: number;
  onUpdate?: (updates: Partial<SlideData>) => void;
}

export const getSpringPath = (stiffness: number, damping: number, width: number, height: number, startYOffset: number = 0, endYOffset: number = 0) => {
  const startShift = (startYOffset / 100) * height;
  const endShift = (endYOffset / 100) * height;
  
  const startY = (height * 0.8) - startShift;
  const endY = (height * 0.8) - endShift; // Default both to same baseline for intuitive control
  
  const controlX = (damping / 100) * width;
  const controlY = (height * 0.8) - (stiffness / 100) * height - ((startShift + endShift) / 2);
  
  return `M 0 ${startY} Q ${controlX} ${controlY} ${width} ${endY}`;
};

const Slide: React.FC<SlideProps> = ({ slide, designSystem, index, totalSlides, onUpdate }) => {
  const layout = slide.layoutType || 'default';
  const bgColor = (designSystem as any).backgroundColor || '#3f352c';
  const accentColor = designSystem.primaryColor;

  const DEFAULT_TITLE_SIZE: Record<string, number> = {
    'romina-hook': 160, 'romina-sticky': 110, 'romina-table': 72,
    'chart': 80, 'default': 120, 'editorial': 120,
  };
  const titleSize = slide.titleSize ?? (DEFAULT_TITLE_SIZE[layout] || 120);
  const contentSize = slide.contentSize ?? 44;

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
            className="text-[14px] font-bold tracking-[0.4em] uppercase outline-none"
            style={{ color: accentColor, opacity: 0.4 }}
          >
            {slide.subtitle || 'CINEMATIC PERSPECTIVE'}
          </div>
          <div className="w-16 h-[2px] opacity-30" style={{ backgroundColor: accentColor }}></div>
        </div>
        <div className="text-[40px] font-monument opacity-10" style={{ color: accentColor }}>
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
              className="font-monument leading-[0.75] tracking-[-0.06em] uppercase italic outline-none"
              style={{ color: accentColor, fontSize: `${titleSize}px` }}
            >
              {slide.title}
            </h1>
            <div
              contentEditable suppressContentEditableWarning
              onBlur={(e) => handleTextUpdate('content', e)}
              className="leading-tight opacity-90 max-w-[900px] outline-none mx-auto"
              style={{ color: accentColor, fontSize: `${contentSize}px` }}
            >
              {slide.content}
            </div>
          </div>
        ) : layout === 'romina-sticky' ? (
          <div className="relative flex justify-center items-center h-full py-20 px-10">
            <div className="relative p-24 pt-32 rounded-[8px] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.35)] rotate-[-0.8deg] w-[880px] min-h-[780px] flex flex-col z-10"
                 style={{ backgroundColor: accentColor, color: bgColor }}>
              {/* 3D Paperclip */}
              <div className="absolute top-[-40px] left-[18%] w-12 h-36 pointer-events-none z-[30]">
                <div className="absolute inset-0 border-4 rounded-full z-[-1] translate-y-2" style={{ borderColor: `${bgColor}1a` }}></div>
                <div className="absolute inset-0 border-4 rounded-full bg-transparent h-[68%] border-b-0 z-[40]" style={{ borderColor: `${bgColor}b3` }}></div>
              </div>
              <div className="flex flex-col items-center gap-10 mb-16">
                <h1
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => handleTextUpdate('title', e)}
                  className="font-monument leading-none uppercase italic tracking-tighter outline-none"
                  style={{ fontSize: `${titleSize}px` }}
                >
                  {slide.title}
                </h1>
                <div className="w-full h-[3px] rounded-full" style={{ backgroundColor: `${bgColor}0d` }}></div>
              </div>
              <div
                contentEditable suppressContentEditableWarning
                onBlur={(e) => handleTextUpdate('content', e)}
                className="leading-[1.6] font-bold text-center whitespace-pre-wrap outline-none"
                style={{ fontSize: `${contentSize}px` }}
              >
                {slide.content}
              </div>
            </div>
          </div>
        ) : layout === 'romina-table' ? (
          <div className="space-y-12 w-full">
            <h2 className="font-monument leading-none uppercase mb-12 italic opacity-90" style={{ fontSize: `${titleSize}px`, color: accentColor }}>{slide.title}</h2>
            <div className="rounded-[40px] overflow-hidden backdrop-blur-xl"
                 style={{ border: `1px solid ${accentColor}33`, backgroundColor: `${accentColor}0d` }}>
               <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-[20px] font-monument uppercase tracking-widest"
                        style={{ backgroundColor: `${accentColor}1a`, borderBottom: `1px solid ${accentColor}33`, color: accentColor }}>
                      <th className="p-10 text-left">{slide.tableData?.headers?.[0] || 'SIDE A'}</th>
                      <th className="p-10 text-left">{slide.tableData?.headers?.[1] || 'SIDE B'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(slide.tableData?.rows || [['Feature A', 'Feature B']]).map((row, i) => (
                      <tr key={i} className="transition-colors text-[28px]"
                          style={{ borderBottom: `1px solid ${accentColor}1a`, color: `${accentColor}cc` }}>
                        <td className="p-10 font-medium">{row?.[0] || '-'}</td>
                        <td className="p-10 font-medium">{row?.[1] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : layout === 'chart' ? (
          (() => {
            const stiffness = slide.chartData?.stiffness || 100;
            const damping = slide.chartData?.damping || 50;
            const startYOffset = slide.chartData?.startYOffset || 0;
            const endYOffset = slide.chartData?.endYOffset || 0;
            const strokeW = slide.chartData?.strokeWidth ?? 14;
            const fillOp = (slide.chartData?.fillOpacity ?? 30) / 100;
            const curvePath = getSpringPath(stiffness, damping, 1000, 400, startYOffset, endYOffset);
            const startShift = (startYOffset / 100) * 400;
            const endShift = (endYOffset / 100) * 400;
            const startY = 400 * 0.8 - startShift;
            const endY = 400 * 0.8 - endShift;
            const fillPath = `${curvePath} L 1000 ${endY} L 1000 380 L 0 380 L 0 ${startY} Z`;
            return (
              <div className="space-y-16">
                <h1 className="font-monument uppercase italic text-center mb-16" style={{ fontSize: `${titleSize}px`, color: accentColor }}>{slide.title}</h1>
                <div className="h-[500px] w-full relative px-24">
                  <div className="absolute left-6 top-0 h-full w-[2px] flex flex-col justify-between py-10 text-[18px] font-black tracking-[0.5em] uppercase"
                       style={{ backgroundColor: `${accentColor}1a`, color: `${accentColor}4d` }}>
                    <span className="rotate-[-90deg] translate-x-[-30px] whitespace-nowrap">{slide.chartData?.yAxisLabel || 'RETENTION'}</span>
                  </div>
                  <svg viewBox="0 0 1000 400" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
                        <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
                      </linearGradient>
                      <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={accentColor} stopOpacity={fillOp} />
                        <stop offset="100%" stopColor={accentColor} stopOpacity={fillOp * 0.3} />
                      </linearGradient>
                    </defs>
                    {[0, 1, 2, 3].map(i => (
                      <line key={i} x1="0" y1={i * 100 + 50} x2="1000" y2={i * 100 + 50} stroke={accentColor} strokeOpacity="0.08" strokeWidth="2" />
                    ))}
                    <path d={fillPath} fill="url(#fillGradient)" stroke="none" />
                    <path
                      d={curvePath}
                      fill="none" stroke="url(#curveGradient)" strokeWidth={strokeW} strokeLinecap="round" className="opacity-90"
                    />
                    <line x1="0" y1="380" x2="1000" y2="380" stroke={accentColor} strokeOpacity="0.25" strokeWidth="4" />
                  </svg>
                  <div className="absolute bottom-[-50px] left-24 right-24 flex justify-between text-[16px] font-black tracking-[0.6em] uppercase"
                       style={{ color: `${accentColor}66` }}>
                    <span>{slide.chartData?.xStartLabel || '0:00'}</span>
                    <span>{slide.chartData?.xAxisLabel || 'TIME'}</span>
                    <span>{slide.chartData?.xEndLabel || '0:60'}</span>
                  </div>
                </div>
                <div className="text-[36px] leading-relaxed opacity-80 italic text-center max-w-[850px] mx-auto mt-24 pt-12"
                     style={{ borderTop: `1px solid ${accentColor}0d`, color: accentColor }}>{slide.content}</div>
              </div>
            );
          })()
        ) : (
          <div className="max-w-[900px] space-y-16">
            <h1 className="font-monument leading-[0.9] tracking-[-0.04em] uppercase" style={{ fontSize: `${titleSize}px`, color: accentColor }}>{slide.title}</h1>
            <div className="leading-[1.4] opacity-80 font-medium whitespace-pre-wrap" style={{ fontSize: `${contentSize}px`, color: accentColor }}>{slide.content}</div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-16 z-10 flex justify-between items-end" style={{ color: accentColor }}>
        <div className="flex flex-col gap-4">
          <span className="text-[20px] font-bold font-monument tracking-tight">@GMMohit</span>
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div key={i} className="h-[6px] rounded-full transition-all duration-500"
                   style={{ width: i === index ? '80px' : '20px', backgroundColor: i === index ? accentColor : `${accentColor}1a` }}></div>
            ))}
          </div>
        </div>
        {totalSlides > 1 && (
          <div className="px-10 py-5 rounded-full text-[14px] font-bold tracking-[0.5em] uppercase opacity-30 border"
               style={{ borderColor: `${accentColor}20`, backgroundColor: `${accentColor}0d` }}>SWIPE LEFT</div>
        )}
      </div>
    </div>
  );
};

export default Slide;
