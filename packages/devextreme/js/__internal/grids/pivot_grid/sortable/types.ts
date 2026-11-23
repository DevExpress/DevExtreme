import type { dxElementWrapper } from '@js/core/renderer';
import type { DOMComponentProperties } from '@ts/core/widget/dom_component';

import type { OldSortable } from './sortable';

export interface OldSortableDraggingArgs {
  sourceGroup: string | undefined;
  sourceIndex: number;
  sourceElement: dxElementWrapper;
  targetGroup: string | undefined;
  targetIndex: number;
  cancel?: boolean;
}

export interface OldSortableChangedArgs {
  sourceIndex: number;
  sourceElement: dxElementWrapper;
  sourceGroup: string | undefined;
  targetIndex: number;
  targetGroup?: string;
  removeSourceElement: boolean;
  removeTargetElement: boolean;
  removeSourceClass: boolean;
}

export interface OldSortableProperties extends DOMComponentProperties<OldSortable> {
  onChanged: ((e: OldSortableChangedArgs) => void) | null;
  onDragging: ((e: OldSortableDraggingArgs) => void) | null;
  itemRender: (($sourceItem: dxElementWrapper, target: string) => dxElementWrapper) | null;
  groupSelector: string | null;
  itemSelector: string;
  itemContainerSelector: string;
  sourceClass: string;
  dragClass: string;
  targetClass: string;
  direction: string;
  allowDragging: boolean;
  groupFilter: ((this: Element, index: number, element: Element) => unknown) | null;
  useIndicator: boolean;
}

export interface OldSortableItemOffset {
  item: dxElementWrapper;
  index: number;
  posVertical: number;
  posHorizontal: number | undefined;
}

export interface OldSortableScrollWrapper {
  moveIfNeed: (event: { pageY: number }) => void;
  element: () => dxElementWrapper;
  dispose: () => void;
}
