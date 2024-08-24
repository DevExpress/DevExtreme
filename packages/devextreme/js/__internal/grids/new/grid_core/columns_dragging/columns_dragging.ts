import type { Subscription } from '@ts/core/reactive';

import type { Column } from '../columns_controller/types';

export interface DraggingElement {
  index: number;

  column: Column;

  element: HTMLElement;
}

export interface DraggingArea {
  draggingArea: HTMLElement;

  draggingElements: DraggingElement[];

  draggingStart: (draggingElement: DraggingElement) => void;

  draggingCancel: () => void;

  draggingHover: (index: number, column: Column) => void;

  draggedOut: (draggingElement: DraggingElement) => void;

  draggedInto: (index: number, column: Column) => void;

  getHoverIndex: (x: number, y: number) => number;
}

export function createHorizontalHoverIndexFunc(elements: HTMLElement): DraggingArea['getHoverIndex'] {
  return (x: number, y: number): number => {
    throw new Error('not implemented');
  };
}

export function createVerticalHoverIndexFunc(elements: HTMLElement): DraggingArea['getHoverIndex'] {
  return (x: number, y: number): number => {
    throw new Error('not implemented');
  };
}

export class ColumnsDraggingController {
  public static dependencies = [] as const;

  public registerDraggingArea(area: DraggingArea): Subscription {
    throw new Error('not implemented');
  }
}
