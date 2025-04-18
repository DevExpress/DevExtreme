const CLASS = {
  invisible: 'dx-state-invisible',
};

export default class Overlay {
  element: Selector;

  constructor(selector: Selector) {
    this.element = selector;
  }

  isInvisible(): Promise<boolean> {
    return this.element.hasClass(CLASS.invisible);
  }
}
