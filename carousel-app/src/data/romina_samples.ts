import type { SlideData } from '../types';

export const rominaSamples: SlideData[] = [
  {
    id: 'hesitation-hook',
    title: 'UX IS ABOUT REMOVING HESITATION.',
    content: 'Not adding decoration. If a user has to think about where to click, you have already failed the conversion test.',
    layoutType: 'romina-hook',
    showGrid: true
  },
  {
    id: 'cognitive-load',
    title: 'THE SILENT KILLER: COGNITIVE LOAD.',
    content: 'Every choice you give a user is a chance for them to leave. Structure drives experience. Clarity reduces friction. Minimalist design is a business decision.',
    layoutType: 'editorial',
    showGrid: true
  },
  {
    id: 'retention-physics',
    title: 'THE PHYSICS OF RETENTION',
    content: 'Complex systems have high mass. High mass requires more energy to move. In UX, energy is attention. If the weight of the UI is too high, the user drops off.',
    layoutType: 'chart',
    chartData: {
      stiffness: 120,
      damping: 12,
      mass: 2,
      xAxisLabel: 'COMPLEXITY',
      yAxisLabel: 'DROP-OFF'
    },
    showGrid: true
  },
  {
    id: 'decision-guidance',
    title: 'DESIGN IS DECISION GUIDANCE.',
    content: 'Your job is to control attention. Visual hierarchy is not about aesthetics; it is about controlling the user journey from curiosity to conversion.',
    layoutType: 'romina-sticky',
    showGrid: true
  },
  {
    id: 'direction-vs-decoration',
    title: 'DIRECTION VS. DECORATION',
    content: 'Decoration hides a lack of structure. Direction exposes a clear path. Founders value the path, not the paint.',
    layoutType: 'romina-table',
    tableData: {
      headers: ['DECORATION', 'DIRECTION'],
      rows: [
        ['Focus on aesthetics', 'Focus on guidance'],
        ['Adds complexity', 'Reduces friction'],
        ['Subjective value', 'Objective conversion']
      ]
    },
    showGrid: true
  },
  {
    id: 'visual-noise',
    title: 'REDUCE THE NOISE.',
    content: 'Subtle elegance over loud aesthetics. Premium design feels intentional. If an element doesn\'t guide a decision, delete it.',
    layoutType: 'image-focus',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop',
    showGrid: true
  },
  {
    id: 'final-take',
    title: 'STOP DECORATING. START GUIDING.',
    content: 'UX is about removing hesitation. Flow matters more than individual sections. Build for the journey, not the vanity.',
    layoutType: 'editorial',
    showGrid: true
  }
];
