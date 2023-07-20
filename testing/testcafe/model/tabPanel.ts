import Widget from './internal/widget';
import Tabs from './tabs';
import MultiView from './multiView';
import TabItem from './tabs/item';
import { WidgetName } from '../helpers/createWidget';

const CLASS = {
  tabs: 'dx-tabs',
  multiView: 'dx-multiview',
  item: 'dx-tab',
};

export default class TabPanel extends Widget {
  tabs: Tabs;

  multiView: MultiView;

  constructor(id: string) {
    super(id);

    this.tabs = new Tabs(`.${CLASS.tabs}`);
    this.multiView = new MultiView(`.${CLASS.multiView}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getName(): WidgetName { return 'dxTabPanel'; }

  public getItem(index = 0): TabItem {
    return new TabItem(this.element.find(`.${CLASS.item}`).nth(index));
  }
}
