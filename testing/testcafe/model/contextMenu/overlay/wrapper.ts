import { Selector, ClientFunction } from 'testcafe';

const CLASS = {
  overlayWrapper: 'dx-overlay-wrapper',
  contextMenu: 'dx-context-menu',
};

export default class OverlayWrapper {
  element: Selector;

  constructor() {
    this.element = Selector(`.${CLASS.overlayWrapper}`);
  }

  async getVisibility(): Promise<string> {
    const { element } = this;
    const contextMenuClass = CLASS.contextMenu;

    return ClientFunction(() => $(element()).find(`.${contextMenuClass}`).css('visibility'), {
      dependencies: { element, contextMenuClass },
    })();
  }
}
