import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import { WidgetName } from '../../helpers/createWidget';
import ContextMenu from '../contextMenu';

const CLASS = {
  menu: 'dx-menu',
  item: 'dx-menu-item',
  contextMenu: 'dx-context-menu',
};

export default class Menu extends Widget {
  items: Selector;

  constructor() {
    super(`.${CLASS.menu}`);

    this.items = Selector(`.${CLASS.item}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxMenu'; }

  getItem(index: number): Selector {
    return this.items.nth(index);
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
