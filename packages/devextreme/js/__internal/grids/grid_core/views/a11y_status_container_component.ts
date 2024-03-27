import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

const CLASSES = {
  container: 'dx-gridbase-a11y-status-container',
};

export type A11yLiveType = 'polite' | 'assertive';

export interface A11yStatusContainerComponentProps {
  statusText?: string;
  a11yLiveType: A11yLiveType;
}

export const A11yStatusContainerComponent = (
  { statusText, a11yLiveType }: A11yStatusContainerComponentProps,
): dxElementWrapper => $('<div>')
  .text(statusText ?? '')
  .addClass(CLASSES.container)
  .attr('role', 'status')
  .attr('aria-live', a11yLiveType);
