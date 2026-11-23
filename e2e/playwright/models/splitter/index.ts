import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import ResizeHandle from './resizeHandle';

const CLASS = {
  item: 'dx-splitter-item',
  resizeHandle: 'dx-resize-handle',
};

export default class Splitter extends Widget {
  name: WidgetName = 'dxSplitter';

  public getResizeHandles(): Locator {
    return this.element.locator(`.${CLASS.resizeHandle}`);
  }

  public getResizeHandle(index = 0): ResizeHandle {
    return new ResizeHandle(this.getResizeHandles().nth(index));
  }

  public getItem(index = 0): Locator {
    return this.element.locator(`.${CLASS.item}`).nth(index);
  }
}
