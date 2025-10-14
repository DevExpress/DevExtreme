import { GroupPanelItem } from './groupPanelItem';

const ITEM_SELECTOR = '.dx-group-panel-item';

export class GroupPanel {
  constructor(public readonly element: Selector) {}

  getHeader(i: number): GroupPanelItem {
    return new GroupPanelItem(this.element.find(ITEM_SELECTOR).nth(i));
  }

  getHeadersCount(): Promise<number> {
    return this.element.find(ITEM_SELECTOR).count;
  }
}
