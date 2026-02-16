import type { ToastType } from 'devextreme/ui/toast';
import type { NotifyStack } from './types.ts';

export const directions: NotifyStack['direction'][] = [
  'down-push',
  'down-stack',
  'up-push',
  'up-stack',
  'left-push',
  'left-stack',
  'right-push',
  'right-stack',
];

export const positions: NotifyStack['position'][] = [
  'top left',
  'top center',
  'top right',
  'bottom left',
  'bottom center',
  'bottom right',
  'left center',
  'center',
  'right center',
];

export const types: ToastType[] = ['error', 'info', 'success', 'warning'];

export const radioGroupItems: string[] = ['predefined', 'coordinates'];

export const positionTopLabel = { 'aria-label': 'Position Top' };
export const positionBottomLabel = { 'aria-label': 'Position Bottom' };
export const positionLeftLabel = { 'aria-label': 'Position Left' };
export const positionRightLabel = { 'aria-label': 'Position Right' };
export const directionLabel = { 'aria-label': 'Direction' };
export const positionLabel = { 'aria-label': 'Position' };
