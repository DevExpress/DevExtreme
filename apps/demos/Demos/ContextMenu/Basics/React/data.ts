import type { ContextMenuItem } from './types';

export const contextMenuItems: ContextMenuItem[] = [
  {
    text: 'Share',
    items: [
      { text: 'Facebook' },
      { text: 'Twitter' }],
  },
  { text: 'Download' },
  { text: 'Comment' },
  { text: 'Favorite' },
];
