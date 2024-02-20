import { Orientation, TabsIconPosition, TabsStyle } from 'devextreme/common';

export const tabsText = [
  {
    id: 0,
    text: 'User',
  },
  {
    id: 1,
    text: 'Analytics',
  },
  {
    id: 2,
    text: 'Clients',
  },
  {
    id: 3,
    text: 'Orders',
  },
  {
    id: 4,
    text: 'Favorites',
  },
  {
    id: 5,
    text: 'Search',
  },
];

export const tabsIconAndText = [
  {
    id: 0,
    text: 'User',
    icon: 'user',
  },
  {
    id: 1,
    text: 'Analytics',
    icon: 'chart',
  },
  {
    id: 2,
    text: 'Clients',
    icon: 'accountbox',
  },
  {
    id: 3,
    text: 'Orders',
    icon: 'ordersbox',
  },
  {
    id: 4,
    text: 'Favorites',
    icon: 'bookmark',
  },
  {
    id: 5,
    text: 'Search',
    icon: 'search',
  },
];

export const tabsIcon = [
  {
    id: 0,
    icon: 'user',
  },
  {
    id: 1,
    icon: 'chart',
  },
  {
    id: 2,
    icon: 'accountbox',
  },
  {
    id: 3,
    icon: 'ordersbox',
  },
  {
    id: 4,
    icon: 'bookmark',
  },
  {
    id: 5,
    icon: 'search',
  },
];

export const orientations: Orientation[] = ['horizontal', 'vertical'];

export const stylingModes: TabsStyle[] = [
  'primary',
  'secondary',
];

export const orientationLabel = { 'aria-label': 'Orientation' };
export const stylingModeLabel = { 'aria-label': 'Styling Mode' };
export const iconPositionLabel = { 'aria-label': 'Icon Position' };

export const iconPositions: TabsIconPosition[] = [
  'top',
  'start',
  'end',
  'bottom',
];
