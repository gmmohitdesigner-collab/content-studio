export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
}

export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  secondaryContent?: string;
  image?: string;
  panoramaMode?: boolean;
  panoramaOffset?: number;
  showGrid?: boolean;
  titleSize?: number;
  contentSize?: number;
  layoutType?: 'editorial' | 'grid' | 'diagram' | 'default' | 'romina-hook' | 'romina-table' | 'romina-sticky' | 'chart' | 'image-focus';
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  chartData?: {
    stiffness: number;
    damping: number;
    startYOffset?: number;
    endYOffset?: number;
    xAxisLabel?: string;
    yAxisLabel?: string;
    xStartLabel?: string;
    xEndLabel?: string;
    strokeWidth?: number;
    fillOpacity?: number;
  };
  diagramData?: {
    points: string[];
  };
}

export interface DesignSystem {
  primaryColor: string;
  primaryLight: string;
  primaryDark: string;
  fontFamily: string;
  showGlobalGrid: boolean;
  gridColor: string;
  gridStroke: number;
  backgroundColor: string;
}

export interface AppState {
  slides: SlideData[];
  designSystem: DesignSystem;
  mediaLibrary: MediaItem[];
}
