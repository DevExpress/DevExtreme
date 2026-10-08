import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { SCREEN_READER_ONLY_CLASS } from '@ts/core/widget/widget';

const CLASSES = {
  container: SCREEN_READER_ONLY_CLASS,
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
