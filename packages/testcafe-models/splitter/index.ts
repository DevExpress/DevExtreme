import ResizeHandle from './handle';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import SplitterItem from './item';

const CLASS = {
  item: 'dx-splitter-item',
  resizeHandle: 'dx-resize-handle',
};

export default class Splitter extends Widget {
  itemElements: Selector;

  resizeHandles: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.itemElements = this.element.find(`.${CLASS.item}`);
    this.resizeHandles = this.element.find(`.${CLASS.resizeHandle}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxSplitter'; }

  public getResizeHandle(index = 0): ResizeHandle {
    return new ResizeHandle(this.resizeHandles.nth(index));
  }

  public getItem(index = 0): SplitterItem {
    return new SplitterItem(this.itemElements.nth(index));
  }
}
