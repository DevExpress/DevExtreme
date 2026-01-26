import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

const CLASSES = {
  container: 'dx-gridbase-a11y-status-container',
};

export interface A11yStatusContainerComponentProps {
  statusText?: string;
}

export const A11yStatusContainerComponent = (
  { statusText }: A11yStatusContainerComponentProps,
): dxElementWrapper => $('<div>')
  .text(statusText ?? '')
  .addClass(CLASSES.container)
  .attr('role', 'status');
