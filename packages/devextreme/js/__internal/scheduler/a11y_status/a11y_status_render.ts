import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

const CLASSES = {
  container: 'dx-screen-reader-only',
};

export const createA11yStatusContainer = (statusText = ''): dxElementWrapper => $('<div>')
  .text(statusText)
  .addClass(CLASSES.container)
  .attr('role', 'status');
