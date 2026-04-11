import type { dxElementWrapper } from '@js/core/renderer';

export interface ViewItem {
  focus: () => void;

  makeFocusable: () => void;

  resize: (
    geometry?: { height: number, width: number, top: number, left: number },
  ) => void;

  $element: () => dxElementWrapper;
}
