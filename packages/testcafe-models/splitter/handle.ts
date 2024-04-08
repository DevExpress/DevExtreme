const CLASS = {
  focused: 'dx-state-focused',
  collapsePrev: 'dx-resize-handle-collapse-prev-pane',
  collapseNext: 'dx-resize-handle-collapse-next-pane',
  handle: 'dx-resize-handle-icon',
};

export default class ResizeHandle {
  element: Selector;

  isFocused: Promise<boolean>;

  constructor(element: Selector) {
    this.element = element;
    this.isFocused = element.hasClass(CLASS.focused);
  }

  public getCollapsePrev(): Selector {
    return this.element.find(`.${CLASS.collapsePrev}`);
  }

  public getHandle(): Selector {
    return this.element.find(`.${CLASS.handle}`);
  }

  public getCollapseNext(): Selector {
    return this.element.find(`.${CLASS.collapseNext}`);
  }
}
