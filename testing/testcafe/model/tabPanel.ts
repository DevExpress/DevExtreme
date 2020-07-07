import Widget from './internal/widget';
import Tabs from './tabs';
import MultiView from './multiView';

const CLASS = {
  tabs: 'dx-tabs',
  multiView: 'dx-multiview',
};

export default class TabPanel extends Widget {
  tabs: Tabs;

  multiView: MultiView;

  name = 'dxTabPanel';

  constructor(id: string) {
    super(id);

    this.tabs = new Tabs(`.${CLASS.tabs}`);
    this.multiView = new MultiView(`.${CLASS.multiView}`);
  }
}
