export interface IconFontConfig {
  fileName: string;
  family: string;
  theme: string;
  grid: number;
  created: string;
}

export const ICON_FONTS: IconFontConfig[] = [
  {
    fileName: 'dxicons', family: 'dxiconsgeneric', theme: 'generic', grid: 18, created: '2026-04-13T11:44:41Z',
  },
  {
    fileName: 'dxiconsmaterial', family: 'dxiconsmaterial', theme: 'material', grid: 24, created: '2026-04-13T11:41:48Z',
  },
  {
    fileName: 'dxiconsfluent', family: 'dxiconsfluent', theme: 'fluent', grid: 20, created: '2026-04-13T11:39:04Z',
  },
];

export const FONT_FORMATS = ['ttf', 'woff', 'woff2'] as const;

export const ATTRIBUTION = {
  manufacturer: 'Developer Express Inc.',
  description: 'DevExpress Icons',
  vendorUrl: 'https://js.devexpress.com/',
  license: 'DevExtreme Complete End User License Agreement',
  licenseUrl: 'https://js.devexpress.com/EULAs/DevExtremeComplete/',
};

export const copyright = (releaseYear: number): string => `Copyright © 2011 - ${releaseYear} Developer Express Inc.`;
