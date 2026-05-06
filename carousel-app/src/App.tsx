import { useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import EditorSidebar from './components/EditorSidebar';
import CarouselCanvas from './components/CarouselCanvas';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  secondaryContent?: string;
  layoutType?: 'editorial' | 'grid' | 'diagram' | 'default' | 'romina-hook' | 'romina-table' | 'romina-sticky' | 'chart' | 'image-focus';
  image?: string;
  showGrid?: boolean;
  panoramaMode?: boolean;
  titleSize?: number;
  contentSize?: number;
  tableData?: { headers: string[]; rows: string[][]; };
  chartData?: { stiffness: number; damping: number; mass?: number; xAxisLabel?: string; yAxisLabel?: string; xStartLabel?: string; xEndLabel?: string; strokeWidth?: number; fillOpacity?: number; startYOffset?: number; endYOffset?: number; };
}

interface DesignSystem {
  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  fontFamily: string;
  showGlobalGrid: boolean;
  gridColor: string;
  gridStroke: number;
  backgroundColor: string;
}

// FULL FIDELITY SAMPLES
const CORE_SAMPLES: SlideData[] = [
  {
    id: 'hesitation-hook',
    title: 'UX IS ABOUT REMOVING HESITATION.',
    subtitle: 'THE CONVERSION KILLER',
    content: 'Not adding decoration. If a user has to think about where to click, you have already failed the conversion test.',
    layoutType: 'romina-hook',
    showGrid: true
  },
  {
    id: 'cognitive-load',
    title: 'THE SILENT KILLER: COGNITIVE LOAD.',
    subtitle: 'PSYCHOLOGY OF CHOICE',
    content: 'Every choice you give a user is a chance for them to leave. Structure drives experience. Clarity reduces friction.',
    layoutType: 'editorial',
    showGrid: true
  },
  {
    id: 'retention-physics',
    title: 'THE PHYSICS OF RETENTION',
    subtitle: 'ATTENTION MASS INDEX',
    content: 'Complex systems have high mass. High mass requires more energy to move. In UX, energy is attention. If the weight of the UI is too high, the user drops off.',
    layoutType: 'chart',
    chartData: { stiffness: 120, damping: 12, mass: 2, xAxisLabel: 'COMPLEXITY', yAxisLabel: 'DROP-OFF' },
    showGrid: true
  },
  {
    id: 'decision-guidance',
    title: 'DESIGN IS DECISION GUIDANCE.',
    subtitle: 'ATTENTION CONTROL',
    content: 'Your job is to control attention. Visual hierarchy is not about aesthetics; it is about controlling the user journey.',
    layoutType: 'romina-sticky',
    showGrid: true
  },
  {
    id: 'direction-vs-decoration',
    title: 'DIRECTION VS. DECORATION',
    subtitle: 'FOUNDER-CENTRIC VALUE',
    content: 'Decoration hides a lack of structure. Direction exposes a clear path. Founders value the path, not the paint.',
    layoutType: 'romina-table',
    tableData: {
      headers: ['DECORATION', 'DIRECTION'],
      rows: [['Focus on aesthetics', 'Focus on guidance'], ['Adds complexity', 'Reduces friction'], ['Subjective value', 'Objective conversion']]
    },
    showGrid: true
  },
  {
    id: 'visual-noise',
    title: 'REDUCE THE NOISE.',
    subtitle: 'SUBTLE ELEGANCE',
    content: 'Subtle elegance over loud aesthetics. Premium design feels intentional. If an element doesn\'t guide a decision, delete it.',
    layoutType: 'image-focus',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop',
    showGrid: true
  },
  {
    id: 'final-take',
    title: 'STOP DECORATING. START GUIDING.',
    subtitle: 'THE FINAL VERDICT',
    content: 'UX is about removing hesitation. Flow matters more than individual sections. Build for the journey, not the vanity.',
    layoutType: 'editorial',
    showGrid: true
  }
];

const DEFAULT_DESIGN: DesignSystem = {
  primaryColor: '#fcf5ee',
  primaryLight: '#ffffff',
  primaryDark: '#d1c7bc',
  fontFamily: '"Circular Std", sans-serif',
  showGlobalGrid: true,
  gridColor: '#fcf5ee',
  gridStroke: 1,
  backgroundColor: '#3f352c',
};

const THEME_DARK  = { backgroundColor: '#3f352c', primaryColor: '#fcf5ee', primaryLight: '#ffffff', primaryDark: '#d1c7bc', gridColor: '#fcf5ee' };
const THEME_LIGHT = { backgroundColor: '#fcf5ee', primaryColor: '#3f352c', primaryLight: '#5c4f43', primaryDark: '#8c7d72', gridColor: '#3f352c' };

const STORAGE_KEY_SLIDES = 'carousel_generator_slides_v6';
const STORAGE_KEY_DESIGN = 'carousel_generator_design_v6';

function App() {
  const [slides, setSlides] = useState<SlideData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLIDES);
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return CORE_SAMPLES;
  });

  const [designSystem, setDesignSystem] = useState<DesignSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DESIGN);
      if (saved && saved !== 'undefined') return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_DESIGN;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SLIDES, JSON.stringify(slides));
    localStorage.setItem(STORAGE_KEY_DESIGN, JSON.stringify(designSystem));
  }, [slides, designSystem]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary-hex', designSystem.primaryColor);
    root.style.setProperty('--color-primary-light-hex', designSystem.primaryLight);
    root.style.setProperty('--color-primary-dark-hex', designSystem.primaryDark);
    root.style.setProperty('--color-brand-bg-hex', designSystem.backgroundColor || '#3f352c');
  }, [designSystem]);

  const updateSlide = (id: string, updates: Partial<SlideData>) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const reorderSlides = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const newSlides = [...slides];
    const [moved] = newSlides.splice(fromIndex, 1);
    newSlides.splice(toIndex, 0, moved);
    setSlides(newSlides);
  };

  const removeSlide = (index: number) => {
    setSlides(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const handleExport = async () => {
    try {
      for (const slide of slides) {
        const element = document.getElementById(`slide-${slide.id}`);
        if (element) {
          const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
          const link = document.createElement('a');
          link.download = `slide-${slide.id}.png`;
          link.href = dataUrl;
          link.click();
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#111]">
      <div className={`h-full bg-[#1e1e1e] transition-all duration-300 ease-in-out overflow-hidden border-r border-[#333] flex-shrink-0 relative ${sidebarCollapsed ? 'w-0' : 'w-[400px]'}`}>
        <EditorSidebar
          slides={slides as any}
          designSystem={designSystem as any}
          mediaLibrary={[]}
          onUpdateSlides={setSlides as any}
          onDeleteSlide={removeSlide}
          onUpdateDesign={setDesignSystem as any}
          onUpdateMedia={() => {}}
          onReorderSlides={reorderSlides}
          onExport={handleExport}
        />
      </div>

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="h-10 bg-[#252526] border-b border-[#333] flex items-center px-4 z-50 gap-4">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-[#858585] hover:text-white transition-colors flex-shrink-0">
            {sidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
          <div className="text-[11px] text-[#858585] uppercase tracking-widest font-bold flex-shrink-0">GMMohit Content Studio — v4.0</div>
          <div className="ml-auto flex items-center gap-1 bg-[#1a1a1a] border border-[#333] rounded p-0.5">
            <button
              onClick={() => setDesignSystem(prev => ({ ...prev, ...THEME_DARK }))}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${designSystem.backgroundColor === '#fcf5ee' ? 'text-[#555]' : 'bg-[#3f352c] text-[#fcf5ee]'}`}
            >Dark</button>
            <button
              onClick={() => setDesignSystem(prev => ({ ...prev, ...THEME_LIGHT }))}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${designSystem.backgroundColor === '#fcf5ee' ? 'bg-[#fcf5ee] text-[#3f352c]' : 'text-[#555]'}`}
            >Light</button>
          </div>
        </div>

        <CarouselCanvas 
          slides={slides as any} 
          designSystem={designSystem as any} 
          onUpdateSlide={updateSlide as any}
        />
      </main>
    </div>
  );
}

export default App;
