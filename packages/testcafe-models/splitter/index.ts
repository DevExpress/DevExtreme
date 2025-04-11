import ResizeHandle from './handle';
import type { WidgetName } from '../types';

import Collection from "../internal/collection";
import CollectionItem from "../internal/collectionItem";

const CLASS = {
  resizeHandle: 'dx-resize-handle',
};

export default class Splitter extends Collection {
  resizeHandles: Selector;

  itemClassName = '.dx-splitter-item';

  ItemClass = CollectionItem;

  constructor(id: string | Selector) {
    super(id);

    this.resizeHandles = this.element.find(`.${CLASS.resizeHandle}`);
  }

  getName(): WidgetName { return 'dxSplitter'; }

  public getResizeHandle(index = 0): ResizeHandle {
    return new ResizeHandle(this.resizeHandles.nth(index));
  }
}
