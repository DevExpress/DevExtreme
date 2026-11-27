import GridElement from '../gridCore/element';
import GroupPanelItem from './groupPanelItem';

const CLASS = {
  item: 'dx-group-panel-item',
};

export default class GroupPanel extends GridElement {
  public getHeader(index: number): GroupPanelItem {
    return new GroupPanelItem(this.element.locator(`.${CLASS.item}`).nth(index));
  }

  public getHeadersCount(): Promise<number> {
    return this.element.locator(`.${CLASS.item}`).count();
  }
}
