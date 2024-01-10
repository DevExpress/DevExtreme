const ITEM_SELECTOR = '.dx-group-panel-item';

export class GroupPanel {
  constructor(private readonly selector: Selector) {}

  getHeader(i: number): Selector {
    return this.selector.find(ITEM_SELECTOR).nth(i);
  }

  getHeadersCount(): Promise<number> {
    return this.selector.find(ITEM_SELECTOR).count;
  }
}
