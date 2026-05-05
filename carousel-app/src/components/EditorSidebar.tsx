import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash2, Download, Settings, Layers, 
  ChevronRight, ChevronDown, FileCode,
  Palette, RotateCcw, Grid,
  Upload, Library,
  Sparkles, Circle
} from 'lucide-react';
import { toPng } from 'html-to-image';
import type { SlideData, DesignSystem, MediaItem } from '../types';
import { getSpringPath } from './Slide';

interface EditorSidebarProps {
  slides: SlideData[];
  designSystem: DesignSystem;
  mediaLibrary: MediaItem[];
  onUpdateSlides: (slides: SlideData[]) => void;
  onUpdateDesign: (design: DesignSystem) => void;
  onUpdateMedia: (media: MediaItem[]) => void;
  onReorderSlides: (from: number, to: number) => void;
  onDeleteSlide: (index: number) => void;
  onExport: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  slides,
  designSystem,
  mediaLibrary,
  onUpdateSlides,
  onUpdateDesign,
  onUpdateMedia,
  onReorderSlides,
  onDeleteSlide,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'assets' | 'ai'>('content');
  const [expandedSlides, setExpandedSlides] = useState<Set<string>>(new Set([slides[0]?.id]));
  const [isDraggingCurve, setIsDraggingCurve] = useState<string | null>(null);
  const curvePreviewRef = useRef<SVGSVGElement>(null);

  const toggleSlide = (id: string) => {
    const next = new Set(expandedSlides);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedSlides(next);
  };

  const addSlide = () => {
    const newSlide: SlideData = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'NEW SLIDE',
      content: 'New content...',
      layoutType: 'default',
      showGrid: true,
      chartData: {
        stiffness: 100,
        damping: 50,
        xAxisLabel: 'RETENTION',
        yAxisLabel: '100%'
      }
    };
    onUpdateSlides([...slides, newSlide]);
    setExpandedSlides(new Set([...expandedSlides, newSlide.id]));
  };

  const updateSlide = (id: string, updates: Partial<SlideData>) => {
    onUpdateSlides(slides.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Drag logic for curve
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingCurve && curvePreviewRef.current) {
        const rect = curvePreviewRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
        const newDamping = Math.round((x / 100) * 50);
        const newStiffness = Math.round((1 - y / 100) * 200);
        const slide = slides.find(s => s.id === isDraggingCurve);
        if (slide && slide.chartData) {
          updateSlide(isDraggingCurve, { chartData: { ...slide.chartData, damping: newDamping, stiffness: newStiffness } });
        }
      }
    };
    const handleMouseUp = () => setIsDraggingCurve(null);
    if (isDraggingCurve) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCurve, slides]);

  const handleMediaUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        url: reader.result as string,
        name: file.name,
        type: file.type
      };
      onUpdateMedia([...mediaLibrary, newItem]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-full w-full bg-[#1e1e1e] select-none text-[#cccccc] font-sans">
      {/* Activity Bar */}
      <div className="w-12 bg-[#2c2c2c] flex flex-col items-center py-4 gap-4 border-r border-[#111] flex-shrink-0">
        <div onClick={() => setActiveTab('content')} className={`p-2 cursor-pointer transition-colors ${activeTab === 'content' ? 'text-white border-l-2 border-[#18a0fb]' : 'text-[#858585] hover:text-white'}`}>
          <Layers className="w-6 h-6" />
        </div>
        <div onClick={() => setActiveTab('ai')} className={`p-2 cursor-pointer transition-colors ${activeTab === 'ai' ? 'text-white border-l-2 border-[#18a0fb]' : 'text-[#858585] hover:text-white'}`}>
          <Sparkles className="w-6 h-6" />
        </div>
        <div onClick={() => setActiveTab('assets')} className={`p-2 cursor-pointer transition-colors ${activeTab === 'assets' ? 'text-white border-l-2 border-[#18a0fb]' : 'text-[#858585] hover:text-white'}`}>
          <Library className="w-6 h-6" />
        </div>
        <div onClick={() => setActiveTab('style')} className={`p-2 cursor-pointer transition-colors ${activeTab === 'style' ? 'text-white border-l-2 border-[#18a0fb]' : 'text-[#858585] hover:text-white'}`}>
          <Palette className="w-6 h-6" />
        </div>
        <div className="mt-auto flex flex-col gap-4 mb-4">
           <button onClick={() => window.location.reload()} title="Reset Workspace" className="text-[#858585] hover:text-red-400">
             <RotateCcw className="w-6 h-6" />
           </button>
           <div className="text-[#858585] hover:text-white cursor-pointer">
             <Settings className="w-6 h-6" />
           </div>
        </div>
      </div>

      {/* Sidebar Content Panel */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="h-9 px-4 flex items-center justify-between bg-[#2c2c2c] text-[11px] uppercase tracking-wider font-semibold border-b border-[#111] flex-shrink-0">
          <span className="truncate">
            {activeTab === 'content' ? 'Explorer: Slides' : activeTab === 'ai' ? 'Hiro Cloud Hub' : activeTab === 'assets' ? 'Media Library' : 'Design System'}
          </span>
          <div className="flex gap-2">
            <button onClick={onExport} className="hover:bg-[#37373d] p-1 rounded text-[#18a0fb]">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#2c2c2c]">
          {activeTab === 'content' ? (
            <div className="py-2">
              {slides.map((slide, index) => (
                <div key={slide.id} className="mb-0.5">
                  <div className="group h-8 px-2 flex items-center justify-between hover:bg-[#37373d] transition-colors cursor-default border-b border-[#1e1e1e]/50">
                    <div onClick={() => toggleSlide(slide.id)} className="flex-1 flex items-center gap-2 cursor-pointer truncate mr-2">
                      {expandedSlides.has(slide.id) ? <ChevronDown className="w-4 h-4 text-[#888]" /> : <ChevronRight className="w-4 h-4 text-[#888]" />}
                      <FileCode className="w-4 h-4 text-[#519aba] flex-shrink-0" />
                      <span className="truncate font-medium text-[13px] text-[#ccc] uppercase tracking-tight">
                        {String(index + 1).padStart(2, '0')} - {slide.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="flex flex-col opacity-0 group-hover:opacity-30 hover:opacity-100 transition-opacity mr-2">
                          <button onClick={(e) => { e.stopPropagation(); onReorderSlides(index, index - 1); }} className="hover:text-white"><ChevronRight className="w-3 h-3 -rotate-90" /></button>
                          <button onClick={(e) => { e.stopPropagation(); onReorderSlides(index, index + 1); }} className="hover:text-white"><ChevronRight className="w-3 h-3 rotate-90" /></button>
                        </div>
                    </div>
                  </div>

                  {expandedSlides.has(slide.id) && (
                    <div className="px-6 py-4 space-y-6 bg-[#2c2c2c] border-b border-[#111]">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#888]">Layout Template</label>
                        <select
                          value={slide.layoutType || 'default'}
                          onChange={(e) => updateSlide(slide.id, { layoutType: e.target.value as any })}
                          className="w-full bg-[#3c3c3c] border border-[#444] rounded px-2 py-1.5 text-[12px] outline-none"
                        >
                          <option value="default">Default Cinematic</option>
                          <option value="romina-hook">Viral Hook</option>
                          <option value="romina-table">Comparison Table</option>
                          <option value="romina-sticky">Sticky Note</option>
                          <option value="diagram">Circular Diagram</option>
                          <option value="chart">Retention Graph</option>
                          <option value="image-focus">Image Focus</option>
                          <option value="editorial">Editorial</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-[#888] tracking-widest">Headline</label>
                        <input 
                          type="text" 
                          value={slide.title} 
                          onChange={(e) => updateSlide(slide.id, { title: e.target.value.toUpperCase() })} 
                          className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[14px] outline-none text-white font-monument transition-all focus:border-[#666]" 
                        />
                      </div>

                      {slide.layoutType === 'chart' ? (
                        <div className="space-y-6">
                          <label className="text-[10px] uppercase font-bold text-[#888] tracking-widest">Curve Sculptor</label>
                          <div className="relative aspect-[16/9] bg-[#1a1a1a] rounded-lg border border-[#444] overflow-hidden group/sculptor cursor-crosshair">
                            <svg 
                              viewBox="0 0 100 60" 
                              className="w-full h-full p-4 overflow-visible"
                               onMouseMove={(e) => {
                                 if (e.buttons === 1) {
                                   const rect = e.currentTarget.getBoundingClientRect();
                                   const x = ((e.clientX - rect.left) / rect.width) * 100;
                                   const y = 60 - (((e.clientY - rect.top) / rect.height) * 60);
                                   const damping = Math.max(0, Math.min(100, x));
                                   const stiffness = Math.max(0, Math.min(100, y * (100 / 60)));
                                   updateSlide(slide.id, { chartData: { ...slide.chartData, damping, stiffness } as any });
                                 }
                               }}
                             >
                               <line x1="0" y1="30" x2="100" y2="30" stroke="white" strokeOpacity="0.05" />
                               <line x1="50" y1="0" x2="50" y2="60" stroke="white" strokeOpacity="0.05" />
                               <path d={getSpringPath(slide.chartData?.stiffness || 100, slide.chartData?.damping || 50, 100, 60, slide.chartData?.startYOffset || 0, slide.chartData?.endYOffset || 0)} fill="none" stroke="#18a0fb" strokeWidth="2" />
                               <circle cx={slide.chartData?.damping || 50} cy={60 - ((slide.chartData?.stiffness || 100) * 0.6)} r="4" fill="#18a0fb" />
                            </svg>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-bold text-[#888]">Y-Axis Label</label>
                              <input 
                                type="text" 
                                value={slide.chartData?.yAxisLabel || ''} 
                                onChange={(e) => updateSlide(slide.id, { chartData: { ...slide.chartData, yAxisLabel: e.target.value.toUpperCase() } as any })}
                                className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-1.5 text-[11px] text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase font-bold text-[#888]">X-Axis Label</label>
                              <input 
                                type="text" 
                                value={slide.chartData?.xAxisLabel || ''} 
                                onChange={(e) => updateSlide(slide.id, { chartData: { ...slide.chartData, xAxisLabel: e.target.value.toUpperCase() } as any })}
                                className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-1.5 text-[11px] text-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-[#888]">Start Height</label>
                                <span className="text-[10px] text-[#18a0fb] font-mono">{slide.chartData?.startYOffset || 0}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="-40" 
                                max="60" 
                                step="1"
                                value={slide.chartData?.startYOffset || 0} 
                                onChange={(e) => updateSlide(slide.id, { chartData: { ...slide.chartData, startYOffset: parseInt(e.target.value) } as any })}
                                className="w-full h-1.5 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#18a0fb]"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] uppercase font-bold text-[#888]">End Height</label>
                                <span className="text-[10px] text-[#18a0fb] font-mono">{slide.chartData?.endYOffset || 0}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="-40" 
                                max="60" 
                                step="1"
                                value={slide.chartData?.endYOffset || 0} 
                                onChange={(e) => updateSlide(slide.id, { chartData: { ...slide.chartData, endYOffset: parseInt(e.target.value) } as any })}
                                className="w-full h-1.5 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#18a0fb]"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-[#888] tracking-widest">Insight Caption</label>
                            <textarea 
                              value={slide.content} 
                              onChange={(e) => updateSlide(slide.id, { content: e.target.value })} 
                              rows={3}
                              className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[12px] outline-none text-white font-circular resize-none leading-relaxed transition-all focus:border-[#666]" 
                            />
                          </div>
                        </div>
                      ) : slide.layoutType === 'romina-table' ? (
                        <div className="space-y-4">
                          <label className="text-[10px] uppercase font-bold text-[#888] tracking-widest">Table Data</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Header A"
                              value={slide.tableData?.headers?.[0] || ''} 
                              onChange={(e) => {
                                const newHeaders = [...(slide.tableData?.headers || ['', ''])];
                                newHeaders[0] = e.target.value.toUpperCase();
                                updateSlide(slide.id, { tableData: { ...slide.tableData, headers: newHeaders } as any });
                              }}
                              className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[11px] font-bold text-[#18a0fb] outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="Header B"
                              value={slide.tableData?.headers?.[1] || ''} 
                              onChange={(e) => {
                                const newHeaders = [...(slide.tableData?.headers || ['', ''])];
                                newHeaders[1] = e.target.value.toUpperCase();
                                updateSlide(slide.id, { tableData: { ...slide.tableData, headers: newHeaders } as any });
                              }}
                              className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[11px] font-bold text-[#18a0fb] outline-none"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            {(slide.tableData?.rows || [['', '']]).map((row, i) => (
                              <div key={i} className="grid grid-cols-2 gap-2 group/row relative">
                                <input 
                                  type="text" 
                                  value={row[0]} 
                                  onChange={(e) => {
                                    const newRows = [...(slide.tableData?.rows || [])];
                                    newRows[i] = [e.target.value, row[1]];
                                    updateSlide(slide.id, { tableData: { ...slide.tableData, rows: newRows } as any });
                                  }}
                                  className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[12px] text-white/80 outline-none"
                                />
                                <input 
                                  type="text" 
                                  value={row[1]} 
                                  onChange={(e) => {
                                    const newRows = [...(slide.tableData?.rows || [])];
                                    newRows[i] = [row[0], e.target.value];
                                    updateSlide(slide.id, { tableData: { ...slide.tableData, rows: newRows } as any });
                                  }}
                                  className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[12px] text-white/80 outline-none"
                                />
                                <button 
                                  onClick={() => {
                                    const newRows = (slide.tableData?.rows || []).filter((_, rowIndex) => rowIndex !== i);
                                    updateSlide(slide.id, { tableData: { ...slide.tableData, rows: newRows } as any });
                                  }}
                                  className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/row:opacity-100 p-1 text-red-500/50 hover:text-red-500 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newRows = [...(slide.tableData?.rows || []), ['', '']];
                                updateSlide(slide.id, { tableData: { ...slide.tableData, rows: newRows } as any });
                              }}
                              className="w-full py-2 border border-dashed border-[#444] rounded text-[10px] font-bold text-[#888] hover:text-white hover:border-[#666] transition-all uppercase tracking-widest"
                            >
                              + Add Row
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-[#888] tracking-widest">Body Paragraph</label>
                          <textarea 
                            value={slide.content} 
                            onChange={(e) => updateSlide(slide.id, { content: e.target.value })} 
                            rows={4}
                            className="w-full bg-[#2d2d2d] border border-[#404040] rounded px-3 py-2 text-[13px] outline-none text-white font-circular resize-none leading-relaxed transition-all focus:border-[#666]" 
                          />
                        </div>
                      )}

                      {/* NEW: DEDICATED SLIDE ACTIONS SECTION */}
                      <div className="pt-4 mt-4 border-t border-[#444] space-y-3">
                        <label className="text-[10px] uppercase font-bold text-[#888] tracking-widest">Slide Actions</label>
                        <div className="grid grid-cols-2 gap-2">
                           <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              const element = document.getElementById(`slide-${slide.id}`);
                              if (element) {
                                toPng(element, { quality: 1.0, pixelRatio: 2 }).then(dataUrl => {
                                  const link = document.createElement('a');
                                  link.download = `slide-${slide.id}.png`;
                                  link.href = dataUrl;
                                  link.click();
                                });
                              }
                            }} 
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-[#18a0fb]/10 hover:bg-[#18a0fb]/20 border border-[#18a0fb]/30 rounded text-[11px] font-bold text-[#18a0fb] uppercase tracking-widest transition-all"
                          >
                            <Download className="w-3.5 h-3.5" /> Export Frame
                          </button>

                          <button 
                            onClick={() => onDeleteSlide(index)} 
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-900/10 hover:bg-red-900/30 border border-red-500/20 rounded text-[11px] font-bold text-red-500 uppercase tracking-widest transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Frame
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addSlide} className="mt-4 mx-6 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Slide
              </button>
            </div>
          ) : activeTab === 'ai' ? (
            <div className="flex flex-col h-full bg-[#2c2c2c] p-8 space-y-8 text-center items-center justify-center">
               <div className="w-16 h-16 rounded-full bg-[#18a0fb]/10 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-[#18a0fb]" />
               </div>
               <div className="space-y-3">
                  <h3 className="text-white font-bold text-[16px]">Hiro Cloud Link</h3>
                  <p className="text-[11px] text-[#888] leading-relaxed max-w-[200px]">
                    I am connected via the IDE. To generate new content or insights, simply talk to me in our shared chat window.
                  </p>
               </div>
               <div className="bg-[#18a0fb]/5 border border-[#18a0fb]/20 px-4 py-2 rounded-full flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-[#18a0fb]" />
                  <span className="text-[10px] font-bold text-[#18a0fb] uppercase tracking-widest">DNA SYNCED</span>
               </div>
            </div>
          ) : activeTab === 'assets' ? (
            <div className="p-4 space-y-6">
               <label className="flex flex-col items-center justify-center gap-3 bg-white/5 border-2 border-dashed border-[#444] rounded-xl p-8 cursor-pointer hover:bg-white/10 transition-all group">
                  <Upload className="w-6 h-6 text-white" />
                  <div className="text-center font-bold text-white text-[13px]">Upload New Asset</div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleMediaUpload(e.target.files[0])} />
               </label>
            </div>
          ) : (
            <div className="p-6 space-y-8">
               <div className="flex items-center justify-between p-3 bg-[#3c3c3c] rounded border border-[#444]">
                  <label className="text-[11px] uppercase font-bold text-white flex items-center gap-2"><Grid className="w-4 h-4 text-[#18a0fb]" /> Global Grid Overlay</label>
                  <input type="checkbox" checked={designSystem.showGlobalGrid} onChange={(e) => onUpdateDesign({ ...designSystem, showGlobalGrid: e.target.checked })} className="w-4 h-4 rounded border-[#444] text-[#18a0fb] bg-[#2c2c2c]" />
               </div>
            </div>
          )}
        </div>

        <div className="h-6 bg-[#2c2c2c] text-[#888] px-3 flex items-center justify-between text-[11px] flex-shrink-0 font-bold border-t border-[#111]">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-[#18a0fb]">HIRO CLOUD HUB ACTIVE</span>
            <span className="opacity-60 text-green-500 flex items-center gap-1"><Circle className="w-2 h-2 fill-green-500" /> DNA SYNCED</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white">
            <span>MOHIT DNA v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
