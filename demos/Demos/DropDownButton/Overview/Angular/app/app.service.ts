import { Injectable } from '@angular/core';
import { DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';

export type ItemObject = DxDropDownButtonTypes.Item & { value: number | string, name: string };

const colors = [null, '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff', '#ff3466'];
const profileSettings: ItemObject[] = [
  { value: 1, name: 'Profile', icon: 'user' },
  {
    value: 4, name: 'Messages', icon: 'email', badge: '5',
  },
  { value: 2, name: 'Friends', icon: 'group' },
  { value: 3, name: 'Exit', icon: 'runner' },
];
const downloads = ['Download Trial For Visual Studio', 'Download Trial For All Platforms', 'Package Managers'];
const alignments: ItemObject[] = [
  { value: 'left', name: 'Left', icon: 'alignleft' },
  { value: 'right', name: 'Right', icon: 'alignright' },
  { value: 'center', name: 'Center', icon: 'aligncenter' },
  { value: 'justify', name: 'Justify', icon: 'alignjustify' },
];
const fontSizes: ItemObject[] = [
  { value: 10, name: '10px' },
  { value: 12, name: '12px' },
  { value: 14, name: '14px' },
  { value: 16, name: '16px' },
  { value: 18, name: '18px' },
];
const lineHeights: ItemObject[] = [
  { value: 1, name: '1' },
  { value: 1.35, name: '1.35' },
  { value: 1.5, name: '1.5' },
  { value: 2, name: '2' },
];

@Injectable()
export class Service {
  getColors(): string[] {
    return colors;
  }

  getDownloads(): string[] {
    return downloads;
  }

  getAlignments(): ItemObject[] {
    return alignments;
  }

  getProfileSettings(): ItemObject[] {
    return profileSettings;
  }

  getFontSizes(): ItemObject[] {
    return fontSizes;
  }

  getLineHeights(): ItemObject[] {
    return lineHeights;
  }
}
