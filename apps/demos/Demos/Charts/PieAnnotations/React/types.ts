import type { PieChartAnnotationLocation } from 'devextreme/viz/pie_chart';

export type AnnotationSource = {
  country: string;
  location?: PieChartAnnotationLocation;
  offsetX?: number;
  offsetY?: number;
  image?: string;
  data?: DataSourceItem;
  color?: string;
  borderColor?: string;
  shadowOpacity?: number;
};

export type DataSourceItem = {
  country: string;
  oldCountryName?: string;
  gold: number;
  silver: number;
  bronze: number;
};
