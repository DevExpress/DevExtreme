export type ProfileSetting = {
  id: number;
  name: string;
  icon: string;
  badge?: string;
};

export type Alignment = {
  id: number;
  name: string;
  icon: string;
};

export type FontSize = {
  size: number;
  text: string;
};

export type LineHeight = {
  lineHeight: number;
  text: string;
};

export type TextAlign = 'center' | 'end' | 'justify' | 'left' | 'match-parent' | 'right' | 'start';
