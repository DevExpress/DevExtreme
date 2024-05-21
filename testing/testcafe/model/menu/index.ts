import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import type { WidgetName } from '../../helpers/widgetTypings';
import ContextMenu from '../contextMenu';

const CLASS = {
  menu: 'dx-menu',
  item: 'dx-menu-item',
  adaptiveItem: 'dx-treeview-item',
  contextMenu: 'dx-context-menu',
  hamburgerButton: 'dx-menu-hamburger-button',
};

export default class Menu extends Widget {
  items: Selector;

  constructor(adaptivityEnabled = false) {
    super(`.${CLASS.menu}`);

    const itemClass = adaptivityEnabled ? `.${CLASS.adaptiveItem}` : `.${CLASS.item}`;
    this.items = Selector(itemClass).filterVisible();
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxMenu'; }

  getItem(index: number): Selector {
    return this.items.nth(index);
  }

  getHamburgerButton(): Selector {
    return this.element.find(`.${CLASS.hamburgerButton}`);
  }

  // eslint-disable-next-line class-methods-use-this
  isElementFocused(element: Selector): Promise<boolean> {
    return element.hasClass('dx-state-focused');
  }

  // eslint-disable-next-line class-methods-use-this
  getSubMenuInstance(rootElement: Selector): ContextMenu {
    return new ContextMenu(rootElement.find(`.${CLASS.contextMenu}`));
  }
}
