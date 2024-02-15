import { camelize } from '@js/core/utils/inflector';

export function getActionNameByEventName(eventName: string): string {
  return `_${camelize(eventName.replace('on', ''))}Action`;
}

export const RESIZE_EVENT = {
  onResize: 'onResize',
  onResizeStart: 'onResize',
  onResizeEnd: 'onResize',
};
