import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

const CLASSES = {
  container: 'dx-scheduler-a11y-status-container',
};

export const createA11yStatusContainer = (statusText = ''): dxElementWrapper => $('<div>')
  .text(statusText)
  .addClass(CLASSES.container)
  .attr('role', 'status');
