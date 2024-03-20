import { camelize } from '@js/core/utils/inflector';

import type { CollapseEvents, ResizeEvents } from './types';

export function getActionNameByEventName(eventName: string): string {
  return `_${camelize(eventName.replace('on', ''))}Action`;
}

export const RESIZE_EVENT: Record<string, ResizeEvents> = {
  onResize: 'onResize',
  onResizeStart: 'onResizeStart',
  onResizeEnd: 'onResizeEnd',
};

export const COLLAPSE_EVENT: Record<string, CollapseEvents> = {
  onCollapsePrev: 'onCollapsePrev',
  onCollapseNext: 'onCollapseNext',
};

export const ITEM_COLLAPSED_EVENT = 'onItemCollapsed';
export const ITEM_EXPANDED_EVENT = 'onItemExpanded';
